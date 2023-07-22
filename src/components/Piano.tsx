export function Piano() {
	return (
		<div className='relative mx-auto flex max-w-2xl'>
			<KeyWhite/>
			<KeyWhite/>
			<KeyWhite/>
			<KeyWhite/>
			<KeyWhite/>
			<KeyWhite/>
			<KeyWhite/>
			<KeyBlack position={1}/>
			<KeyBlack position={2}/>
			<KeyBlack position={4}/>
			<KeyBlack position={5}/>
			<KeyBlack position={6}/>
		</div>
	);
}

function KeyWhite() {
	return (
		<div
			className='h-56 flex-1 border border-stone-950'
			style={{width: `${100 / 7}%`}}
			onClick={event => {
				console.debug('KeyWhite | onClick | event: ', event);
			}}
		/>
	);
}

function KeyBlack({
	position,
}: {
	position: number;
}) {
	return (
		<div
			className='absolute h-36 -translate-x-1/2 border border-stone-950 bg-stone-950'
			style={{
				width: `${((100 / 7) * 0.75)}%`,
				left: `${((100 / 7) * (position))}%`,
			}}
			onClick={event => {
				console.debug('KeyBlack | onClick | event: ', event);
			}}
		/>
	);
}
