import React from 'react';
import { Link } from 'react-router-dom';

function LandingCards({ to, icon, text }) {
  return (
    <Link to={to}>
      <div
        className="align-middle justify-center flex flex-col py-12 px-10 2xl:py-16 2xl:px-14 bg-[#9773AF] shadow-lg hover:shadow-[#691b9d] rounded-[40px] hover:cursor-pointer text-white border-[0.2px] bg-clip-padding bg-opacity-10  border-gray-300"
        style={{ backdropFilter: 'blur(15px)' }}
      >
        {icon}
        <h1 className="align-middle justify-center text-center text-sm 2xl:text-lg 3xl:text-xl mt-6">{text}</h1>
      </div>
    </Link>
  );
}

export default LandingCards;