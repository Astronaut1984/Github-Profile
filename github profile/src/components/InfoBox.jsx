function InfoBox({ title, content }) {
  return (
    <div className="px-7 py-3 bg-search-dropdown-bg text-foreground w-full sm:w-auto flex justify-between items-center rounded-lg gap-3">
      <p className="whitespace-nowrap">{title}</p>
      <div className="w-0 border-l-2 self-stretch"></div>
      <p className="whitespace-nowrap">{content}</p>
    </div>
  );
}

export default InfoBox;
