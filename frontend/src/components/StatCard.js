function StatCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl text-white shadow-lg ${color}`}>
      <h4 className="text-lg">{title}</h4>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default StatCard;
