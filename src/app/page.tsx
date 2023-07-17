export default function IndexPage() {
	return (
		<Container>
			<div className='py-16 md:py-20'>
				Hello
			</div>
		</Container>
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
