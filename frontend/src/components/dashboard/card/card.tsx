import { MdSupervisedUserCircle } from "react-icons/md";

const Card = ({ item }: { item: any }) => {
  return (
    <div className="bgSoft p-4 rounded-lg flex items-center gap-4 cursor-pointer w-full hover:bg-[#2e374a]">
      <MdSupervisedUserCircle size={24} />
      <div className="flex flex-col gap-4">
        <span className="font-bold text-lg">{item.title}</span>
        <span
          className={`text-xl ${
            item.change > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {item.number}
        </span>
      </div>
    </div>
  );
};

export default Card;
