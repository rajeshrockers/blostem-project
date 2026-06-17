interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  return (
    <div className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a1.5 1.5 0 001.475-1.236l1.696-6.348a.75.75 0 00-.962-.908l-1.68.565a3.752 3.752 0 01-2.679 0l-1.68-.565a.75.75 0 00-.963.908l1.696 6.348A2.25 2.25 0 015.378 15h2.5a.75.75 0 000-1.5H6.54l-2.558-9.592A3 3 0 001.046 3.75H2.25zM4.5 18.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm12 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
}
