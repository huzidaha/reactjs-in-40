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

const mountComponent = (component, hostComponent) => {
  if (isStringOrNumber(component)) return component
  if (component === null || component === undefined) return ''
  if (typeof component.type === 'string') {
    component.children = mountChildrenComponent(component.props.children)
    if (hostComponent) {
      hostComponent.root = component
      return hostComponent
    } else {
      return component
    }
  } else {
    const renderedElement = component.render()
    return mountComponent(renderedElement, component)
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
    listenEvents(node, el)
    return node
  } else if (isStringOrNumber(el)) {
    return document.createTextNode('' + el)
  } else if (el.root) {
    updateWhenSetState(el)
    el.node = createDOM(el.root)
    return el.node
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
    const oldNode = component.node
    component.root = mountComponent(component).root
    component.node = createDOM(component.root)
    oldNode.parentNode.insertBefore(component.node, oldNode)
    oldNode.parentNode.removeChild(oldNode)
  }
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
