export class Component {
  setState (state) {
    this.state = state
    if (this.onStateChange) this.onStateChange()
  }
}

export const mount = (wrapper, component) => {
  const el = mountComponent(component)
  el.node = createDOM(el)
  wrapper.appendChild(el.node)
}

const mountComponent = (component) => {
  if (isStringOrNumber(component)) return component
  if (component === null || component === undefined) return ''
  if (typeof component.type === 'string') {
    component.children = mountChildrenComponent(component.props.children)
    return component
  } else {
    const renderedElement = component.render()
    component.renderedElement = renderedElement
    mountComponent(renderedElement)
    return component
  }
}

const mountChildrenComponent = (children, newChildren = []) => {
  if (Array.isArray(children)) {
    children.forEach((child, i) => {
      if (Array.isArray(child)) {
        mountChildrenComponent(child, newChildren)
      } else {
        newChildren.push(mountComponent(child))
      }
    })
  } else {
    newChildren.push(mountComponent(children))
  }
  return newChildren
}

const createDOM = (el) => {
  if (typeof el.type === 'string') {
    const node = document.createElement(el.type)
    el.children.forEach((child) => {
      node.appendChild(createDOM(child))
    })
    el.node = node
    listenEvents(node, el)
    return node
  } else if (el.renderedElement) {
    updateWhenSetState(el)
    return createDOM(el.renderedElement)
  } else if (isStringOrNumber(el)) {
    return document.createTextNode('' + el)
  } else {
    return null
  }
}

const listenEvents = (node, component) => {
  Object.keys(component.props).forEach((prop) => {
    if (prop.startsWith('on')) {
      const eventName = prop.replace('on', '').toLowerCase()
      node.addEventListener(eventName, component.props[prop], false)
    }
  })
}

const updateWhenSetState = (component) => {
  component.onStateChange = () => {
    const oldNode = findNode(component)
    component.renderedElement = mountComponent(component).renderedElement
    const newNode = createDOM(component.renderedElement)
    oldNode.parentNode.insertBefore(newNode, oldNode)
    oldNode.parentNode.removeChild(oldNode)
  }
}

const findNode = (component) => {
  while (component.renderedElement) {
    component = component.renderedElement
  }
  return component.node
}

const isStringOrNumber = (item) => {
  return typeof item === 'string' || typeof item === 'number'
}

export default class React {
  static createElement(Component, props, ...children) {
    const el = typeof Component === 'function'
      ? new Component(props)
      : { type: Component }
    el.props = props
    if (children) {
      if (el.props) {
        el.props.children = children
      } else {
        el.props = { children }
      }
    }
    return el
  }
}
