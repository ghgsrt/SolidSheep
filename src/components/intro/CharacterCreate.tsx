import { Component, For, createEffect, createSignal } from 'solid-js';
// import { state } from '../../contexts/SessionState';
import { entityLUT } from '../../core/LUTs';

type props = {};

const CharacterCreate: Component<props> = () => {
	const [value, setValue] = createSignal('');
	const [character, _setCharacter] = createSignal('');
	const characters: string[] = [];

	createEffect(() => {
		entityLUT.PL!.name = value();
		entityLUT.PL!.portrait = character();
		entityLUT.MP1;
	});

	return (
		<>
			<div class='character-create'>
				<div class='characters'>
					<For each={characters}>
						{(character) => (
							<div
								class='character'
								style={{
									background: `url(/characters/${character})`,
								}}
							></div>
						)}
					</For>
				</div>
				<input
					type='text'
					class='character-create-name'
					onInput={(e) => setValue(e.target.value)}
				/>
			</div>
		</>
	);
};

export default CharacterCreate;
