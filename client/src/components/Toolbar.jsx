import React from 'react';
import "../styles/toolbar.scss";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import toolState from "../store/toolState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";

const Toolbar = () => {

    const changeColor = e => {
        toolState.setStrokeColor(e.target.value);
        toolState.setFillColor(e.target.value);
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL();
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = canvasState.sessionId + '.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <div className={'toolbar'}>
            <button className={'toolbar__btn brush'}
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}>Brush
            </button>
            <button className={'toolbar__btn rect'}
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}>Rect
            </button>
            <button className={'toolbar__btn circle'}
                    onClick={() => toolState.setTool(new Circle(canvasState.canvas))}>Circle
            </button>
            <button className={'toolbar__btn eraser'}
                    onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}>Eraser
            </button>
            <button className={'toolbar__btn line'}
                    onClick={_ => toolState.setTool(new Line(canvasState.canvas))}>Line
            </button>
            <input onChange={e => changeColor(e)} style={{marginLeft: 10}} type={"color"}/>
            <button className={'toolbar__btn undo'} onClick={() => canvasState.undo()}>Undo</button>
            <button className={'toolbar__btn redo'} onClick={() => canvasState.redo()}>Redo</button>
            <button className={'toolbar__btn save'} onClick={() => download()}>Save</button>
        </div>
    );
};

export default Toolbar;