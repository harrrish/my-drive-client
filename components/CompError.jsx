export default function CompError({ error }) {
  return (
    <div>
      <h1 className="bg-red-500 font-staat tracking-wider text-center text-clr1 py-1">
        {error}
      </h1>
    </div>
  );
}
