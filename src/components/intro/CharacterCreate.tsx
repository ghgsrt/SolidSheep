import { Component, For, createSignal, onMount } from 'solid-js';
// import { state } from '../../contexts/SessionState';
import { entityLUT } from '../../core/LUTs';
import { useView } from '../../contexts/View';
import {
	amoMPNames,
	femaleMPNames,
	maleMPNAmes,
} from '../../core/dialogues/entities/entity';
import { getRandomElement } from '../../utils/utils';

type props = {};

let input: HTMLInputElement;
const CharacterCreate: Component<props> = () => {
	const [value, setValue] = createSignal('');
	const [characterIdx, setCharacterIdx] = createSignal<number | undefined>(
		undefined
	);
	const view = useView()!;
	let characters = [
		{
			portrait: 'player.png',
			name: getRandomElement(maleMPNAmes),
		},
		{
			portrait: 'player-female.png',
			name: getRandomElement(femaleMPNames),
		},
		{
			portrait: 'player-amo.png',
			name: getRandomElement(amoMPNames),
		},
	];

	const startGame = () => {
		if (characterIdx() === undefined || !value()) return;

		entityLUT.PL!.portraitName = value();
		entityLUT.PL!.portrait = characters[characterIdx()!].portrait;
		characters = characters.filter((_, i) => i !== characterIdx());
		const mp1 = characters[characterIdx()! % 2 === 0 ? 'shift' : 'pop']()!;
		const mp2 = characters.pop()!;

		entityLUT.MP1!.portrait = mp1.portrait;
		entityLUT.MP1!.portraitName = mp1.name;
		entityLUT.MP2!.portrait = mp2.portrait;
		entityLUT.MP2!.portraitName = mp2.name;

		view.updateView('main');
	};

	onMount(() => input.focus());

	return (
		<>
			<div class='character-create'>
				<div class='characters'>
					<For each={characters}>
						{(character, i) => (
							<div
								class='wrapper'
								classList={{
									selected: characterIdx() === i(),
								}}
							>
								<div
									class='character'
									style={{
										'background-image': `url(/characters/${character.portrait})`,
									}}
									onClick={() => setCharacterIdx(i())}
								></div>
								<div class='character-bg'></div>
							</div>
						)}
					</For>
				</div>
				<div class='wrapper'>
					<input
						ref={input}
						type='text'
						class='character-create-name'
						placeholder='Enter Your Name'
						onKeyDown={(e) => e.key === 'Enter' && startGame()}
						onInput={(e) => setValue(e.target.value)}
						onBlur={(_) => input.focus()}
					/>
					<div
						class='button'
						classList={{
							show: characterIdx() !== undefined && !!value(),
						}}
						onClick={startGame}
					>
						Begin Your Adventure<div class='main-menu-blinker'></div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CharacterCreate;
