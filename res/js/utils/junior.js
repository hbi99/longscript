/* 
 * junior.js v0.1.0 
 * https://github.com/hbi99/junior 
 */
(function(root, document) {
    'use strict';

    if (typeof Object.create !== 'function') {
        Object.create = function(o, props) {
            function F() {}
            F.prototype = o;
            if (typeof(props) === "object") {
                for (var prop in props) {
                    if (props.hasOwnProperty((prop))) {
                        F[prop] = props[prop];
                    }
                }
            }
            return new F();
        };
    }

    var Junior = function() {
        var coll = Object.create(Array.prototype);
        for (var prop in Junior.prototype) {
            if (Junior.prototype.hasOwnProperty(prop)) {
                coll[prop] = Junior.prototype[prop];
            }
        }
        return coll;
    };
    Junior.prototype = {
        find: function(selector, context) {
            var found = [],
                sval,
                type,
                bdown,
                i, il;
            context = context || document;
            if (selector.constructor === Array || (selector.item && selector.item.constructor === Function)) {
                found = selector;
            } else if (selector.nodeType || selector === window) {
                found = [selector];
            } else if (!arguments[1] && this.length > 0) {
                for (i=0, il=this.length; i<il; i++) {
                    found = found.concat(Array.prototype.slice.call(this.find(selector, this[i]), 0));
                }
            } else {
                if (!!document.querySelectorAll) {
                    found = context.querySelectorAll(selector);
                } else {
                    bdown = selector.match(/^./);
                    if (bdown !== null) bdown = bdown[0];
                    switch (bdown) {
                        case '[':
                            bdown = selector.match( (selector.indexOf('=') > -1) ? /\[([\w-:]+)=(.*?)\]/ : /\[([\w-:]+)\]/ );
                            type = bdown[1];
                            if (bdown.length > 2) sval = bdown[2].replace(/"/g, '');
                            break;
                        case '#': sval = selector.slice(1); type = 'id'; break;
                        case '.': sval = selector.slice(1); type = 'className'; break;
                        default:
                            type = 'nodeName';
                            sval = selector;
                    }
                    found = get_children(context, type, sval);
                }
            }
            if (this.length > 0) return jr(found);
            for (i=0, il=found.length; i<il; i++) {
                Array.prototype.push.call(this, found[i]);
            }
            return this;
        },
        toArray: function () {
            return Array.prototype.slice.call(this, 0);
        },
        nth: function(i) {
            return this.find(this.toArray().splice(i, 1));
        },
        index: function() {
            var i=0, el;
            if (!this.length || this[0].nodeType === 3) return;
            el = this[0];
            while (el.previousSibling) {
                el = el.previousSibling;
                if (el.nodeType !== 3) i += 1;
            }
            return i;
        },
        hasClass: function(name) {
            return this.length ? matchesSelector(this[0], '.'+ name) : false;
        },
        addClass: function(names) {
            for (var i=0, il=this.length; i<il; i++) {
                this[i].className = this[i].className.split(/\s+/).concat(names.split(/\s+/)).removeDuplicates().join(' ');
            }
            return this;
        },
        removeClass: function(names, el) {
            var arr = (el)? [el] : this;
            for (var i=0, il=arr.length; i<il; i++) {
                arr[i].className = arr[i].className.split(/\s+/).difference(names.split(/\s+/)).join(' ');
            }
            return arr;
        },
        top: function() {
            return parseInt(this.css('top'), 10);
        },
        left: function() {
            return parseInt(this.css('left'), 10);
        },
        height: function() {
            return parseInt(this.css('height'), 10);
        },
        width: function() {
            return parseInt(this.css('width'), 10);
        },
        css: function (name, value) {
            for (var i=0, il=this.length, fixedName; i<il; i++) {
                if (value) {
                    fixedName = fixStyleName(name);
                } else {
                    switch (typeof (name)) {
                        case 'string':
                            return getStyle(this[i], name);
                        case 'object':
                            for (var key in name) {
                                fixedName = fixStyleName(key);
                                this[i].style[fixedName] = name[key];
                            }
                            break;
                    }
                }
            }
            return this;
        },
        attr: function (name, value, el) {
            var arr = (el) ? [el] : this,
                key;
            for (var i=0, il=arr.length; i<il; i++) {
                if (!value) {
                    switch (typeof (name)) {
                        case 'string':
                            return arr[i].getAttribute(name);
                        case 'object':
                            for (key in name) {
                                arr[i].setAttribute(key, name[key]);
                            }
                            break;
                    }
                } else if (name && value) {
                    arr[i].setAttribute(name, value);
                }
            }
            return arr;
        },
        parent: function () {
            return this.parents();
        },
        parents: function (selector) {
            var found = [],
                match, el;
            selector = selector || '*';
            for (var i=0, il=this.length; i<il; i++) {
                el = this[i].parentNode;
                match = false;
                while (!match && el.nodeType !== 9) {
                    if (matchesSelector(el, selector)) {
                        found.push(el);
                        break;
                    }
                    el = el.parentNode;
                }
            }
            return jr(found);
        },
        select: function (types, callback) {
            this[0].focus();
            this[0].select();
            return this;
        },
        on: function (types, selector, callback) {
            for (var i=0, il=this.length; i<il; i++) {
                sys.events.addEvent(this[i], types, callback, selector);
            }
            return this;
        },
        off: function(types, selector, callback) {
            if (types === 'drag') {
                types += ' mousedown';
            }
            for (var i=0, il=this.length; i<il; i++) {
                sys.events.removeEvent(this[i], types, callback, selector);
            }
            return this;
        },
        bind: function (types, callback) {
            return this.on(types, false, callback);
        },
        unbind: function(types, callback) {
            return this.off(types, false, callback);
        },
        trigger: function(types, el) {
            var arr = (el)? [el] : this,
                type = types.split(/\s+/),
                i=0, il=arr.length,
                j=0, jl=type.length,
                isNative, isStyle, event, el, listener;

            for (; j<jl; j++) {
                isNative = sys.events.nativeEvents.indexOf(type[j]) > -1;
                isStyle = type[j].indexOf('style.') > -1;
                if (isNative) {
                    event = document.createEvent('MouseEvents'),
                    event.initEvent(type[j], true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                } else {
                    event = document.createEvent('Event');
                    event.initEvent(type[j], true, true);
                }
                for (; i<il; i++) {
                    el = arr[i];
                    if (isNative) {
                        el.dispatchEvent(event);
                    } else {
                        while (el.nodeType === 1) {
                            listener = el['on'+ type[j]];
                            if (typeof(listener) === 'function') {
                                if (isStyle) event.run73 = {target: el};
                                listener.call(el, event);
                                if (event.isBubblingCanceled) {
                                    break;
                                }
                            }
                            if (isStyle) return this;
                            el = el.parentNode;
                        }
                    }
                }
            }
            return this;
        },
        html: function(str, el) {
            var arr = (el)? [el] : this,
                sysId=sys.id, tmpId;
            if (!str && str !== '') {
                return arr[0].innerHTML;
            }
            for (var i=0, il=arr.length; i<il; i++) {
                tmpId = arr[i][sysId];
                arr[i].innerHTML = str;
                arr[i][sysId] = tmpId;
            }
            return this;
        },
        offset: function() {
            if (!this.length) return;
            return {
                width: this[0].offsetWidth,
                height: this[0].offsetHeight,
                top: this[0].offsetTop,
                left: this[0].offsetLeft
            };
        },
        insert: function(type, source, el) {
            var arr = (el)? [el] : this,
                new_arr = [],
                isStr = typeof(source) === 'string',
                currEl, currParentEl, isNext, isPrev,
                div = document.createElement('div'),
                moveEl, movedEl, moveAccNr;
            if (isStr) div.innerHTML = source;
            else {
                source = (source.nodeType)? source : source[0];
                div.appendChild(div.cloneNode(false));
            }
            for (var i=0, il=arr.length; i<il; i++) {
                for (var j=0, jl=div.childNodes.length; j<jl; j++) {
                    moveEl = isStr ? div.childNodes[j].cloneNode(true) : source ;
                    moveAccNr = moveEl[sys.id];
                    switch (type) {
                        case 'before':
                            if (isAdjacentSibling(arr[i], moveEl) === -1) continue;
                            movedEl = arr[i].parentNode.insertBefore(moveEl, arr[i]);
                            break;
                        case 'after':
                            if (isAdjacentSibling(arr[i], moveEl) === 1) continue;
                            movedEl = arr[i].parentNode.insertBefore(moveEl, arr[i].nextSibling);
                            break;
                        case 'append':
                            movedEl = arr[i].appendChild(moveEl);
                            break;
                        case 'prepend':
                            movedEl = arr[i].insertBefore(moveEl, arr[i].firstChild);
                            break;
                    }
                    movedEl[sys.id] = moveAccNr;
                    new_arr.push(movedEl);
                }
            }
            return this.find(new_arr);
        },
        before: function(str, el) {
            return this.insert('before', str, el);
        },
        after: function(str, el) {
            return this.insert('after', str, el);
        },
        prepend: function(str, el) {
            return this.insert('prepend', str, el);
        },
        append: function(str, el) {
            return this.insert('append', str, el);
        },
        remove: function(el) {
            var arr = (el)? [el] : this;
            for (var i=0, il=arr.length; i<il; i++) {
                arr[i].parentNode.removeChild(arr[i]);
            }
            return this;
        },
        firstChild: function() {
            return this[0].firstChild;
        },
        isFirst: function() {
            // todo
        },
        isLast: function(selector) {
            var siblings = jr(selector, this.parent()),
                isLast = false;
            if (siblings.length > 0) {
                isLast = this[0] === siblings[ siblings.length - 1];
            }
            return isLast;
        },
        hasChildren: function() {
            for (var i=0, il=this.length; i<il; i++) {
                if (this[i].getElementsByTagName('*').length > 0) {
                    return true;
                }
            }
            return false;
        },
        matchClass: function(expr) {
            var cName, ret;
            if (this.length > 0) {
                cName = this[0].className;
                cName = cName.match(new RegExp(expr +'\\w+', 'ig'));
                if (cName !== null) {
                    ret = cName[0];
                }
            }
            return ret;
        },
        offsetParent: function() {
            var found = [];
            for (var i=0, il=this.length; i<il; i++) {
                if (this.css('display', false, this[i]) === 'none') {
                    this.css('display', 'block', this[i]);
                    found.push(this[i].offsetParent);
                    this.css('display', 'none', this[i]);
                } else {
                    found.push(this[i].offsetParent);
                }
            }
            return jr(found);
        },
        nextPrev: function(selector, direction) {
            var selector = selector || '*',
                found = [], match, el;
            for (var i=0, il=this.length; i<il; i++) {
                el = this[i];
                while (el) {
                    el = el[direction];
                    if (!el) break;
                    if (el.nodeType === 1 && matchesSelector(el, selector)) {
                        found.push(el);
                    }
                }
            }
            return jr(found);
        },
        next: function(selector) {
            return this.nextPrev(selector, 'nextSibling');
        },
        prev: function(selector) {
            return this.nextPrev(selector, 'previousSibling');
        },
        siblings: function(selector) {
            var found = [],
                pEl = this[0].parentNode.childNodes;
            for (var i=0, il=pEl.length; i<il; i++) {
                if (pEl[i].nodeType === 1 && matchesSelector(pEl[i], selector)) {
                    found.push(pEl[i]);
                }
            }
            return jr(found);
        },
        removeAttr: function(name) {
            for (var i=0, il=this.length; i<il; i++) {
                this[i].removeAttribute(name);
            }
            return this;
        },
        data: function(name, value, el) {
            var arr = (el)? [el] : this,
                fromEl;
            if (value && value.nodeType) {
                arr = [value];
                value = false;
            }
            for (var i=0, il=arr.length; i<il; i++) {
                if (!value) {
                    switch (typeof(name)) {
                        case 'string':
                            fromEl = arr[i].getAttribute('data-'+ name);
                            return fromEl || sys.bank.balance(arr[i], name);
                        case 'object':
                            sys.bank.deposit(arr[i], name);
                            break;
                    }
                } else if (name && value) {
                    sys.bank.deposit(arr[i], name, value);
                }
            }
            return arr;
        },
        removeData: function(name, el) {
            var arr = (el)? [el] : this;
            for (var i=0, il=arr.length; i<il; i++) {
                sys.bank.empty(arr[i], name);
            }
            return arr;
        }
    };

    // export junior
    root.jr = function() {
        var njr = new Junior();
        return njr.find.apply(njr, arguments);
    };

})(window, document);