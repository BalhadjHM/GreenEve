"use client";
import React from "react";
import Image from "next/image";

const ExploareBtn = () => {
	return (
		<button
			type="button"
			id="explore-btn"
			className="mt-7 mx-auto"
			onClick={() => {}}
		>
			<a href="#events">
				Explore Events
				<Image
					src="/icons/arrow-down.svg"
					alt="arrow-down"
					width={24}
					height={24}
				/>
			</a>
		</button>
	);
};

export default ExploareBtn;
