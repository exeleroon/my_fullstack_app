import React from 'react';
import '../styles/toolbar.scss';
import toolState from "../store/toolState";

const SettingBar = () => {
    return (
        <div className={'setting-bar'}>
            <label htmlFor={"line-width"}>Line width{' '}</label>
            <input
                onChange={e => toolState.setLineWidth(e.target.value)}
                id={"line-width"}
                defaultValue={1}
                type={"number"}
                min={1}
                max={50}
            />

            <label htmlFor={'stoke-color'}>Stroke color</label>
            <input
                id={'stroke-color'}
                type={'color'}
                onChange={e => toolState.setStrokeColor(e.target.value)}
            />
        </div>
    );
};

export default SettingBar;