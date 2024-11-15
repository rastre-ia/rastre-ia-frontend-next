import { FunctionComponent } from 'react';

interface AnimatedLogoProps {
	className?: string;
}

const AnimatedLogo: FunctionComponent<AnimatedLogoProps> = ({
	className = 'text-4xl font-bold',
}) => {
	return (
		<div className={className}>
			Rastre
			<span className="inline-block animate-colorCycle">IA</span>
		</div>
	);
};

export default AnimatedLogo;
