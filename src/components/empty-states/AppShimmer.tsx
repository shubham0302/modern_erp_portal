const AppShimmer = () => {
  return (
    <div className="dark:bg-nd-900 flex h-dvh flex-col gap-4 p-6">
      <div className="flex w-full flex-col items-center gap-6 md:flex-row">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="shimmer h-80 w-full" key={i} />
        ))}
      </div>
      <div className="shimmer h-40 w-full" />
      <div className="flex w-full flex-col items-center gap-6 md:flex-row">
        {Array.from({ length: 2 }).map((_, i) => (
          <div className="shimmer h-40 w-full" key={i} />
        ))}
      </div>
    </div>
  );
};

export default AppShimmer;
