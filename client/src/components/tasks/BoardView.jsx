import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';
import TaskCard from "./TaskCard";
import { useUpdateTaskMutation } from '../../redux/slices/api/taskApiSlice';
import { toast } from 'sonner';

const COLUMNS = {
  'todo': { 
    id: 'todo', 
    title: 'To Do',
    color: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-500 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  'in progress': { 
    id: 'in progress', 
    title: 'In Progress',
    color: 'bg-yellow-100 dark:bg-yellow-900',
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  'completed': { 
    id: 'completed', 
    title: 'Completed',
    color: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-500 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800'
  }
};

const BoardView = ({ tasks }) => {
  const [columns, setColumns] = useState({
    'todo': [],
    'in progress': [],
    'completed': []
  });

  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    if (!tasks) return;
    
    const newColumns = {
      'todo': tasks.filter(task => task.stage?.toLowerCase() === 'todo'),
      'in progress': tasks.filter(task => task.stage?.toLowerCase() === 'in progress'),
      'completed': tasks.filter(task => task.stage?.toLowerCase() === 'completed')
    };
    setColumns(newColumns);
  }, [tasks]);

  const onDragEnd = useCallback(async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const task = sourceColumn.find(t => t._id === draggableId);

    if (!task) {
      toast.error('Could not find task to move');
      return;
    }

    // Update local state first for immediate feedback
    const newSourceColumn = [...sourceColumn];
    newSourceColumn.splice(source.index, 1);

    const newDestColumn = [...destColumn];
    newDestColumn.splice(destination.index, 0, task);

    const newColumns = {
      ...columns,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestColumn
    };

    setColumns(newColumns);

    try {
      // Update task in the backend
      await updateTask({
        taskId: task._id,
        _id: task._id,
        stage: destination.droppableId
      }).unwrap();
      
      toast.success(`Task moved to ${COLUMNS[destination.droppableId].title}`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      // Revert the UI state on error
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn
      });
      toast.error('Failed to update task status. Please try again.');
    }
  }, [columns, updateTask]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='w-full py-4 grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-6'>
        {Object.entries(COLUMNS).map(([status, { id, title, color, iconColor, borderColor }]) => (
          <div key={id} className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className={`p-3 ${color} rounded-t-lg border-b ${borderColor}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {title}
                </h3>
                <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-sm font-medium ${iconColor}`}>
                  {columns[id]?.length || 0}
                </span>
              </div>
            </div>
            <Droppable droppableId={id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[500px] p-3 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } rounded-b-lg`}
                >
                  {columns[id]?.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-3 transform transition-transform ${
                            snapshot.isDragging ? 'scale-105' : ''
                          }`}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default BoardView;
