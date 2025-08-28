const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
    </div>
  );
};

export default LoadingSpinner;