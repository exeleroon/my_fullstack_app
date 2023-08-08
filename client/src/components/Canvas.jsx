import React, {useEffect, useRef, useState} from 'react';
import '../styles/canvas.scss';
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import toolState from "../store/toolState";
import {Modal, Button} from "react-bootstrap";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from "axios";

const Canvas = observer(() => {
    const canvasRef = useRef();
    const usernameRef = useRef();
    const [modal, setModal] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        let ctx = canvasRef.current.getContext('2d');
        canvasState.setCanvas(canvasRef.current);
        toolState.setTool(new Brush(canvasRef.current));
        axios.get(`http://localhost:5000/image?id=${id}`)
            .then(res => {
                const img = new Image();
                img.src = res.data;
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.heihgt);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            })
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket(`ws://localhost:5000/`);
            canvasState.setSocket(socket);
            canvasState.setSessionId(id);
            toolState.setTool(new Brush(canvasRef.current, socket, id));
            toolState.setTool(new Rect(canvasRef.current, socket, id));
            socket.onopen = () => {
                console.log('Подключение установлено')
                socket.send(JSON.stringify({
                    id: id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (event) => {
                let msg = JSON.parse(event.data);

                switch (msg.method) {
                    case "connection" :
                        console.log(`user ${msg.username} connected`)
                        break;

                    case "draw":
                        drawHandler(msg);
                        break;

                }

            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y, figure.color);
                break;

            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color);
                break;

            case "finish":
                ctx.beginPath();
                break;
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
        canvasState.pushToRedo(canvasRef.current.toDataURL());
        axios.post(`http://localhost:5000/image?id=${id}`, {img: canvasRef.current.toDataURL()})
            .then(res => console.log(res.data))
    }

    const connectHandler = () => {
        canvasState.setUserName(usernameRef.current.value);
        setModal(false);
    }

    return (
        <div className={'canvas'}>
            <Modal show={modal} onHide={() => {
            }}>
                <Modal.Header>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}/>
        </div>
    );
});

export default Canvas;