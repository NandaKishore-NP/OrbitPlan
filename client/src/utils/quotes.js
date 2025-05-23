export const productivityQuotes = [
  {
    quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey"
  },
  {
    quote: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs"
  },
  {
    quote: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    quote: "Do the hard jobs first. The easy jobs will take care of themselves.",
    author: "Dale Carnegie"
  },
  {
    quote: "It's not always that we need to do more but rather that we need to focus on less.",
    author: "Nathan W. Morris"
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    quote: "Time is what we want most, but what we use worst.",
    author: "William Penn"
  },
  {
    quote: "Until we can manage time, we can manage nothing else.",
    author: "Peter Drucker"
  }
];

export const getRandomQuote = () => {
  return productivityQuotes[Math.floor(Math.random() * productivityQuotes.length)];
};
