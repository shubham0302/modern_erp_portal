interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="card p-6">
      <h6 className="text-nl-800 dark:text-nd-100 mb-4 font-semibold">
        {title}
      </h6>
      {children}
    </div>
  );
};

export default ChartCard;
