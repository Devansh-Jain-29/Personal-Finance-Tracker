"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuLink = ({ item }: { item: any }) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.path}
      className={`p-4 flex items-center gap-2 rounded-lg ${
        pathname === item.path ? "bg-[#2e374a]" : ""
      }`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};

export default MenuLink;
