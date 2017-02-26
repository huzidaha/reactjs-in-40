import React, { mount, Component } from './src/React'

/* ========================================= */
class LikeButton extends Component {
  constructor (props) {
    super(props)
    this.state = { isLiked: false }
  }

  onClick () {
    this.setState({
      isLiked: !this.state.isLiked
    })
  }

  render () {
    return (
      <button className='like-btn' onClick={this.onClick.bind(this)}>
        <span class='like-text'>${this.props.word || ''} ${this.state.isLiked ? '取消' : '点赞'}</span>
        <span>👍</span>
      </button>
    )
  }
}

class RedBlueButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      color: 'red'
    }
  }

  onClick () {
    this.setState({
      color: 'blue'
    })
  }

  render () {
    return (
      <div style='color: ${this.state.color};'>${this.state.color}</div>
    )
  }
}

class Main3 {
  render () {
    return (
      <div>{this.props.children}</div>
    )
  }
}

class Index extends Component {
  render () {
    return (
      <Main3 name='HELLO'>
        <LikeButton name='jerry' />
        <LikeButton name='lucy' />
        <RedBlueButton name='tomy' />
      </Main3>
    )
  }
}

///////////////////////////////////////////////////////////////////////
class Index2 extends Component {
  render () {
    return (
      <Main>
        <div>Index.</div>
        <div>Index.</div>
      </Main>
    )
  }
}

class Main extends Component {
  render () {
    return (
      <Main2 name='jerry'>
        <div>Main.</div>
        <div>Main.</div>
        <Main2 name='tomy'>TOMY</Main2>
        {this.props.children}
      </Main2>
    )
  }
}

class Main2 extends Component {
  constructor () {
    super()
    this.state = { flag: 1 }
  }

  handleClick () {
    this.setState({ flag: this.state.flag + 1 })
  }

  render () {
    return (
      <div onClick={::this.handleClick}>
        <div>{this.state.flag} - Main2.{this.props.name}</div>
        <div>Main2.{this.props.name} + 1</div>
        {this.props.children}
      </div>
    )
  }
}

const wrapper = document.querySelector('#wrapper')
mount(wrapper, <Index name='jerry' />)
