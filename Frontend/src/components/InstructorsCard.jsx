const InstructorsCard = ({ name, image, subject, description, bgColor }) => {
  return (
    <div className="
      w-[92%] md:w-full mx-auto flex flex-col
      bg-white dark:bg-gray-50/10
      rounded-2xl overflow-hidden
      border border-zinc-900/10 dark:border-gray-700/30
      transition-all duration-300
    hover:border-blue-500/40
    ">
      
      {/* Image Section */}
      <div className={`${bgColor} w-full flex items-end justify-center h-72 md:h-64`}>
        <img
          className="h-full object-contain"
          src={image}
          alt={`Image of ${name}`}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 px-4 py-6">
        <h3 className="text-lg font-semibold tracking-tight">
          {name}
        </h3>

        <p className="text-sm font-medium text-highlighted">
          {subject}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
          {description}
        </p>
      </div>

    </div>
  );
};

export default InstructorsCard;