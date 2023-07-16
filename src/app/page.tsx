export default function IndexPage() {
	return (
		<>
			<Container>
				<header className='pb-12 pt-16 md:py-20'>
					<h1 className='relative -left-0.5 pb-2 text-5xl font-bold md:-left-1 md:text-7xl'>Simple Synth</h1>
					<p className='text-base md:text-xl'>Simple synthesizer built with Elementary Audio.</p>
				</header>
			</Container>
			<Container>
				<div className='pb-16 md:pb-20'>
					Hello
				</div>
			</Container>
		</>
	);
}

type ContainerProps = {
	children: React.ReactNode;
};
function Container({children}: ContainerProps) {
	return (
		<div className='px-8 md:px-12 lg:px-20'>
			{children}
		</div>
	);
}
