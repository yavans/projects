/**
 * MiniReact — 自建 Virtual DOM + Hooks 框架
 * ~350 行实现 React 核心机制
 */
const MiniReact = (() => {
  // ═══════════════════════════════════════════
  // Virtual DOM
  // ═══════════════════════════════════════════
  function createElement(type, props, ...children) {
    const flat = children.flat(Infinity);
    return {
      type,
      props: props || {},
      children: flat.map(c =>
        typeof c === 'object' ? c : createTextElement(c)
      ),
    };
  }

  function createTextElement(text) {
    return { type: 'TEXT_ELEMENT', props: { nodeValue: text }, children: [] };
  }

  // ═══════════════════════════════════════════
  // Fiber Architecture
  // ═══════════════════════════════════════════
  let nextUnitOfWork = null;
  let wipRoot = null;
  let currentRoot = null;
  let deletions = [];

  // Hooks
  let wipFiber = null;
  let hookIndex = 0;

  function createDom(fiber) {
    const dom =
      fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type);

    updateDom(dom, {}, fiber.props);
    return dom;
  }

  const isEvent = key => key.startsWith('on');
  const isProperty = key => key !== 'children' && !isEvent(key);
  const isNew = (prev, next) => key => prev[key] !== next[key];
  const isGone = (prev, next) => key => !(key in next);

  function updateDom(dom, prevProps, nextProps) {
    // Remove old events
    Object.keys(prevProps)
      .filter(isEvent)
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });

    // Remove old properties
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => { dom[name] = ''; });

    // Set new properties
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => { dom[name] = nextProps[name]; });

    // Add new events
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }

  function commitRoot() {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
  }

  function commitWork(fiber) {
    if (!fiber) return;
    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) domParentFiber = domParentFiber.parent;
    const domParent = domParentFiber.dom;

    if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === 'DELETION') {
      commitDeletion(fiber, domParent);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }

  function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
      domParent.removeChild(fiber.dom);
    } else {
      commitDeletion(fiber.child, domParent);
    }
  }

  function render(element, container) {
    wipRoot = {
      dom: container,
      props: { children: [element] },
      alternate: currentRoot,
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
  }

  // ═══════════════════════════════════════════
  // Work Loop (Scheduler)
  // ═══════════════════════════════════════════
  function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork && wipRoot) commitRoot();
    requestIdleCallback(workLoop);
  }

  requestIdleCallback(workLoop);

  function performUnitOfWork(fiber) {
    const isFunctionComponent = fiber.type instanceof Function;

    if (isFunctionComponent) {
      updateFunctionComponent(fiber);
    } else {
      updateHostComponent(fiber);
    }

    // Return next unit of work
    if (fiber.child) return fiber.child;
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) return nextFiber.sibling;
      nextFiber = nextFiber.parent;
    }
    return null;
  }

  function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];
    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  }

  function updateHostComponent(fiber) {
    if (!fiber.dom) fiber.dom = createDom(fiber);
    reconcileChildren(fiber, fiber.props.children.flat());
  }

  function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling = null;

    while (index < elements.length || oldFiber) {
      const element = elements[index];
      let newFiber = null;

      const sameType = oldFiber && element && element.type === oldFiber.type;

      if (sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: 'UPDATE',
        };
      }
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          parent: wipFiber,
          alternate: null,
          effectTag: 'PLACEMENT',
        };
      }
      if (oldFiber && !sameType) {
        oldFiber.effectTag = 'DELETION';
        deletions.push(oldFiber);
      }

      if (oldFiber) oldFiber = oldFiber.sibling;

      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }
  }

  // ═══════════════════════════════════════════
  // Hooks
  // ═══════════════════════════════════════════
  function useState(initial) {
    const oldHook =
      wipFiber.alternate &&
      wipFiber.alternate.hooks &&
      wipFiber.alternate.hooks[hookIndex];

    const hook = {
      state: oldHook ? oldHook.state : initial,
      queue: [],
    };

    const actions = oldHook ? oldHook.queue : [];
    actions.forEach(action => {
      hook.state = action(hook.state);
    });

    const setState = action => {
      hook.queue.push(action);
      wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
      };
      nextUnitOfWork = wipRoot;
      deletions = [];
    };

    wipFiber.hooks.push(hook);
    hookIndex++;
    return [hook.state, setState];
  }

  function useEffect(callback, deps) {
    const oldHook =
      wipFiber.alternate &&
      wipFiber.alternate.hooks &&
      wipFiber.alternate.hooks[hookIndex];

    const hasChanged =
      !oldHook ||
      !deps ||
      deps.some((dep, i) => dep !== oldHook.deps[i]);

    if (hasChanged) {
      if (oldHook && oldHook.cleanup) oldHook.cleanup();
      // Schedule effect to run after commit
      setTimeout(() => {
        const cleanup = callback();
        const hook = wipFiber.hooks[hookIndex];
        if (hook) hook.cleanup = typeof cleanup === 'function' ? cleanup : null;
      }, 0);
    }

    wipFiber.hooks.push({ deps, cleanup: null });
    hookIndex++;
  }

  return { createElement, render, useState, useEffect };
})();

// Expose globally
if (typeof window !== 'undefined') {
  window.MiniReact = MiniReact;
  window.h = MiniReact.createElement;
}
if (typeof module !== 'undefined') module.exports = MiniReact;
