import React, { useEffect, useReducer, useRef } from 'react';
import GameOver from './GameOver';
import './Snake.css';


const MAP_KEYS = {
    37: 'LEFT',
    65: 'LEFT',
    38: 'UP',
    87: 'UP',
    39: 'RIGHT',
    68: 'RIGHT',
    40: 'DOWN',
    83: 'DOWN'
}

const DIRECTION_FNS = {
    LEFT: ({ width, blockWidth, snake }) => {
        let newX = snake[0].x <= 0 ? width - blockWidth : snake[0].x - blockWidth;
        return { x: newX, y: snake[0].y };
    },
    UP: ({ height, blockHeight, snake }) => {
        let newY = snake[0].y <= 0 ? height - blockHeight: snake[0].y - blockHeight;
        return { x: snake[0].x, y: newY };
    },
    RIGHT: ({ width, blockWidth, snake }) => {
        let newX = snake[0].x >= width - blockWidth ? 0 : snake[0].x + blockWidth;
        return { x: newX, y: snake[0].y }
    },
    DOWN: ({ height, blockHeight, snake }) => {
        let newY = snake[0].y >= height - blockHeight ? 0 : snake[0].y + blockHeight;
        return { x: snake[0].x, y: newY };
    }
};

const getRandomColor = () => {
    let hexa = '0123456789ABCDEF';
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += hexa[Math.floor(Math.random() * 16)];
    }
    return color;
}

const initialState = {
    init: true,
    score: 0,
    width: 0,
    height: 0, 
    blockWidth: 0,
    blockHeight: 0,
    gameLoopTimeout: 50,
    startSnakeSize: 6,
    snake: [],
    food: {},
    direction: 'RIGHT',
    directionChanged: false,
    isGameOver: false,
    snakeColor: getRandomColor(),
    foodColor: getRandomColor(),
    highScore: Number(localStorage.getItem('snakeHighScore')) || 0,
    newHighScore: false
};

const isSnakeEating = (snakeHead, food) => {
    return snakeHead.x === food.x && snakeHead.y === food.y;
};

const isFoodOnSnake = (snake, food) => {
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) return true;
    }
    return false;
};

const isSnakeDead = (snake) => {
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true;
        }
    }
};

const getNewFood = ({ width, blockWidth, height, blockHeight, food, snake }) => {
        food.x = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
        food.y = Math.floor(Math.random() * ((height - blockHeight) / blockHeight)) * blockHeight;
        while (isFoodOnSnake(snake, food)) {
            food.x = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
            food.y = Math.floor(Math.random() * ((height - blockHeight) / blockHeight)) * blockHeight;
        }
        return food
};


const reducer = (state, action) => {
    switch(action.type) {
        case 'INIT_GAME':
            let percentageWidth = 40;
            let width = 
                document.getElementById('GameBoard').parentElement.offsetWidth * (percentageWidth / 100);
            width -= width % 30;
            if (width < 30) width = 30;
            let height = (width / 3) * 2;
            let blockWidth = width / 30;
            let blockHeight = height / 20;

            // init snake
            let startSnakeSize = state.startSnakeSize;
            let snake = [];
            let x = width / 2;
            let y = height / 2;
            let snakeHead = { x: width / 2, y: height / 2 };
            snake.push(snakeHead);
            for (let i = 1; i < startSnakeSize; i++) {
                x -= blockWidth;
                let snakePart = { x: x, y: y };
                snake.push(snakePart);
            }

            // init food position
            let foodx = Math.floor(Math.random() * ((width - blockWidth) / blockWidth + 1)) * blockWidth;
            let foody = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
            while (foody === snake[0].y) {
                foody = Math.floor(Math.random() * ((height - blockHeight) / blockHeight + 1)) * blockHeight;
            }


            return { 
                ...state, 
                init: false,
                width: width, 
                height: height, 
                blockWidth: blockWidth, 
                blockHeight: blockHeight, 
                startSnakeSize: startSnakeSize, 
                snake: snake, 
                food: { x: foodx, y: foody}
            };

        case 'SNAKE_DIRECTION_CHANGE':
            let newDirection;
            if (state.directionChanged) {
                return {
                    ...state
                };
            }
            switch (action.direction) {
                case 'LEFT':
                    newDirection = state.direction === 'RIGHT' ? 'RIGHT' : 'LEFT';
                    break;
                case 'UP':
                    newDirection = state.direction === 'DOWN' ? 'DOWN' : 'UP';
                    break;
                case 'RIGHT':
                    newDirection = state.direction === 'LEFT' ? 'LEFT' : 'RIGHT';
                    break;
                case 'DOWN':
                    newDirection = state.direction === 'UP' ? 'UP' : 'DOWN';
                    break;
                default:
                    throw new Error();
            }
            return {
                ...state,
                direction: newDirection,
                directionChanged: true
            }
        
        case 'SNAKE_EAT':
            return {
                ...state,
                snake: action.newSnake,
                score: action.newScore,
                food: action.newFood,
                highScore: action.highScore,
                directionChanged: false
            };

        case 'SNAKE_MOVE':
            return {
                ...state,
                snake: action.newSnake,
                directionChanged: false
            };

        case 'GAME_OVER':
            return {
                ...state,
                isGameOver: true
            };


        case 'RESET_GAME':
            // reset snake
            let foodReset = { x: 0, y: 0 };
            let snakeReset = [];
            let xReset = state.width / 2;
            let yReset = state.height / 2;
            let snakeHeadReset = {x: state.width / 2, y: state.height / 2 };
            snakeReset.push(snakeHeadReset);
            for (let i = 1; i < state.startSnakeSize; i++) {
                xReset -= state.blockWidth;
                let snakePart = {x: xReset, y: yReset};
                snakeReset.push(snakePart);
            }

            // reset food position 
            foodReset.x = Math.floor(Math.random() * ((state.width - state.blockWidth) / state.blockWidth + 1)) * state.blockWidth;
            foodReset.y = Math.floor(Math.random() * ((state.height - state.blockHeight) / state.blockHeight)) * state.blockHeight;
            while (isFoodOnSnake(state.snake, foodReset)) {
                foodReset.x = Math.floor(Math.random() * ((state.width - state.blockWidth) / state.blockWidth + 1)) * state.blockWidth;
                foodReset.y = Math.floor(Math.random() * ((state.height - state.blockHeight) / state.blockHeight)) * state.blockHeight;
            }

            return {
                ...state,
                snake: snakeReset,
                food: foodReset,
                direction: 'RIGHT',
                directionChanged: false,
                isGameOver: false,
                gameLoopTimeout: 50,
                snakeColor: getRandomColor(),
                foodColor: getRandomColor(),
                score: 0,
                newHighScore: false
            };

        default:
            throw new Error();
    }
};




const Snake = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const moveSnake = (state) => {
        const newSnakeHead = DIRECTION_FNS[state.direction](state);
        const snakeEating = isSnakeEating(newSnakeHead, state.food);

        const tail = snakeEating
            ? state.snake
            : state.snake.slice(0, state.snake.length - 1);
        
        const newFood = snakeEating
            ? getNewFood(state)
            : state.food;
        
        const newSnake = [newSnakeHead, ...tail];

        if (snakeEating) {
            let highScore = state.highScore;
            if (state.score === state.highScore) {
                highScore++;
                localStorage.setItem('snakeHighScore', highScore);
            }
            dispatch({
                type: 'SNAKE_EAT',
                newSnake: newSnake,
                newScore: state.score + 1,
                newFood: newFood,
                highScore: highScore
            });
        } else {
            dispatch({
                type: 'SNAKE_MOVE',
                newSnake: newSnake
            });
        }
    }

    const handleKeyDown = (event) => {
        if (state.isGameOver && event.keyCode === 32) {
            dispatch({
                type: 'RESET_GAME'
            });
            return
        }
        if (state.directionChanged) return;
        if (MAP_KEYS[event.keyCode]) {
            dispatch({
                type: 'SNAKE_DIRECTION_CHANGE',
                direction: MAP_KEYS[event.keyCode]
            })
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        dispatch({
            type: 'INIT_GAME'
        });
    }, []);

    useEffect(() => {
        if (state.init) return;
        const onTick = () => {
            if (isSnakeDead(state.snake)) {
                dispatch({
                    type: 'GAME_OVER'
                });
            }
            else if (!state.isGameOver) {
                moveSnake(state);
            }
        };

        const interval = setInterval(onTick, 50);

        return () => clearInterval(interval);
    }, [state]);

    //useEffect(() => {
      //  gameLoop();
        //return () => {
          //  clearTimeout(state.timeoutId);
        //}
    //}, []);

    if (state.isGameOver) {
        return (
            <GameOver />
        );
    } else {
        return (
            <div
                id='GameBoard'
                style={{
                    width: state.width,
                    height: state.height,
                    borderWidth: state.width / 50,
                }}>
                {state.snake.map((snakePart, index) => {
                    return (
                        <div
                            key={index}
                            className='Block'
                            style={{
                                width: state.blockWidth,
                                height: state.blockHeight,
                                left: snakePart.x,
                                top: snakePart.y,
                                background: state.snakeColor,
                            }}
                        />
                    )
                })}
                <div 
                    className='Block'
                    style={{
                        width: state.blockWidth,
                        height: state.blockHeight,
                        left: state.food.x,
                        top: state.food.y,
                        background: state.foodColor,
                    }}
                />
                <div id='Score' style={{ fontSize: state.width / 20 }}>
                    HIGH-SCORE: {state.highScore}&ensp;&ensp;&ensp;&ensp;SCORE:{' '}
                    {state.score}
                </div>
            </div>
        );
    }
};

export default Snake;

