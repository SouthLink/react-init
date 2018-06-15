import React, {
    Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';

// 函数式组件
// function Square(props) {
//     return (
//         <button className="square" onClick={props.onClick}>
//             {props.value}
//         </button>
//     );
// }

class Square extends React.Component {
    constructor(props) {
        super(props); //在 JavaScript classes(类)中，当定义子类的构造函数时，你需要显式调用 super(); 。
        this.state = {
            value: null,
        }
    }

    render() {
        return ( // 这里利用props属性来调用父组件的方法,从父组件接收值
            <button className='square' onClick={ () => this.props.onClick() }>
                {this.props.value}
            </button>
        )
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        //把棋盘（state）数据集合在父组件，利用点击事件向子组件分发数据
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        }
    }

    // 通过 （shouldComponentUpdate函数）监听数据模型变化，你可以更简单的实现撤消/重做、追踪变更及确定何时重新渲染等复杂功能，
    // 函数仅仅检查 props或者 state 是否发生改变。如果这些值没有发生变化，则组件不会进行更新
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props !== nextProps) {
            return true;
        }
        if (this.state !== nextState) {
            return true;
        }
        return false;
    }

    //点击
    handleClick(i) {
        const squares = this.state.squares.slice(); //复制数组
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });

        console.log(squares) //[null, null, null, "X", null, null, null, null, null]
    }

    renderSquare(i) {
        // return <Square value={i} />;
        return <Square 
                    value={this.state.squares[i]}
                    onClick={ () => this.handleClick(i)}
                />;
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
            <div className='status'>{status}</div>
            <div className='board-row'>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div> 
            <div className='board-row'>
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div> 
            <div className='board-row'>
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div> 
        </div>
        )
    }
}

class Describe extends React.Component {
    render() {
        return (
            <div className='describe'>
                '这是一段描述'
            </div>
        )
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className='game'>
                <div className='game-board'>
                    <Board />
                </div> 
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
                <Describe />
            </div>

        )
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]; //解构
        //X O序列符合之上规则
        if (squares[a] && squares[a] == squares[b] && squares[b] == squares[c]) {
            return squares[a];
        }
    }

    return null;
}

export default Game;


// 更简单的撤消/重做和步骤重现（Easier Undo/Redo and Time Travel）
// 不可变数据（Immutability）还使一些复杂的功能更容易实现。例如，在本教程中，我们将在游戏的不同阶段之间实现时间旅行。避免数据改变使我们能够保留对旧数据的引用，
// 如果我们需要在它们之间切换。

// 追踪变更（Tracking Changes）
// 确定可变对象是否已更改是复杂的，因为直接对对象进行更改。这样就需要将当前对象与先前的副本进行比较，遍历整个对象树，并比较每个变量和值。这个过程可能变得越来越复杂。
// 确定不可变对象如何改变是非常容易的。如果被引用的对象与之前不同，那么对象已经改变了。仅此而已。
// 确定何时重新渲染（Determining When to Re-render in React）

// React 中不可变数据最大好处在于当您构建简单的 纯(pure)组件 时。由于不可变数据可以更容易地确定是否已经进行了更改，这也有助于确定组件何时需要重新渲染。