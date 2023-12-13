import { Component, createEffect, createSignal } from 'solid-js';
import { Item } from '../core/items/item';
import { formatLabel } from '../utils/utils';
import { state } from '../contexts/SessionState';

type props = {
	ref: HTMLDivElement;
	item?: Item;
};

const InventoryItem: Component<props> = (props) => {
	const [hasExamined, setHasExamined] = createSignal(false);

	createEffect(() => {
		//! MAKE THIS LESS JANKY FOR THE LOVE OF GOD
		//@ts-ignore -- force solid to watch state.hasExaminedScroll
		const _force_watch = state.hasExaminedScroll;
		if (props.item) setHasExamined(state.hasExamined(props.item));
	});

	return (
		<>
			<div
				ref={props.ref}
				class={`inventory-item ${props.item !== undefined ? 'populated' : ''}`}
			>
				<div
					class='icon'
					style={{
						'background-image': `url(public/icons/${props.item?.img})`,
					}}
				></div>
			</div>
			{props.item && (
				<section class='tooltip'>
					{hasExamined() ? (
						<>
							<div class='name'>{props.item?.name}</div>
							<hr />
							<div class='description'>{props.item?.description}</div>
							<div>
								<span>{`${formatLabel(props.item?.qName)}: ${
									props.item?.quantity
								}`}</span>
							</div>
						</>
					) : (
						<>
							<div class='name'>{`????? (${props.item?.unknownName})`}</div>
							<hr />
							<div class='description'>{props.item?.unknownDescription}</div>
							<div>
								Perhaps <strong>examining</strong> it will reveal more
								details...
							</div>
						</>
					)}
				</section>
			)}
		</>
	);
};

export default InventoryItem;
