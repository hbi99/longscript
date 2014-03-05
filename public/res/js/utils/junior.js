/* 
 * junior.js v0.1.0 
 * https://github.com/hbi99/junior 
 */
(function(root, document) {
    'use strict';

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
                nthMatch = /\:nth\((\d{1,})\)/,
                isNth,
                i,
                il;
            if (Array.isArray(selector)) {
                found = selector;
            } else if (selector) {
                if (selector.nodeType || selector === window) {
                    found = [selector];
                } else {
                    if (this.length > 0) {
                        context = this.toArray();
                    }
                    if (context) {
                        if (typeof(context) === 'string') {
                            context = document.querySelectorAll(context);
                        }
                    }
                    context = context || document;
                    if (!Array.isArray(context) && !context.find) {
                        context = [context];
                    }
                    isNth = selector.match(nthMatch);
                    if (isNth !== null) {
                        selector = selector.replace(nthMatch, '');
                    }
                    for (i=0, il=context.length; i<il; i++) {
                        found = found.concat(Array.prototype.slice.call(context[i].querySelectorAll(selector), 0));
                    }
                }
            }
            if (isNth && isNth.length === 2) {
                found = found.splice(isNth[1], 1);
            }
            if (this.length > 0) {
                return jr(found);
            }
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
        hasClass: function(names, el) {
            var arr = (el)? [el] : this,
                selector = '.'+ names.split(' ').join('.');
            for (var i=0, il=arr.length; i<il; i++) {
                if (matchesSelector(arr[i], selector)) {
                    return true;
                }
            }
            return false;
        },
        addClass: function(names, el) {
            var arr = (el)? [el] : this;
            for (var i=0, il=arr.length; i<il; i++) {
                arr[i].className = arr[i].className.split(/\s+/).concat(names.split(/\s+/)).removeDuplicates().join(' ');
            }
            return arr;
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
        css: function (name, value, el) {
            var arr = (el)? [el] : this,
                el_balance,
                fixedName;
            for (var i=0, il=arr.length; i<il; i++) {
                if (value) {
                    fixedName = fixStyleName(name);
                }
                if (!value) {
                    switch (typeof(name)) {
                        case 'string':
                            return getStyle(arr[i], name);
                        case 'object':
                            for (var key in name) {
                                fixedName = fixStyleName(key);
                                this[i].style[fixedName] = name[key];
                            }
                            break;
                    }
                } else if (name && value && arr[i].style[fixedName] !== value) {
                    arr[i].style[fixedName] = value;

                    el_balance = sys.bank.balance( arr[i] );
                    if (el_balance && el_balance.events[ 'style.'+ fixedName ]) {
                        this.trigger('style.'+ fixedName);
                    }
                }
            }
            return arr;
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
        select: function () {
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
                i  = 0, 
                il = arr.length,
                j  = 0, 
                jl = type.length,
                isNative,
                event,
                listener;
            for (; j<jl; j++) {
                isNative = sys.events.nativeEvents.indexOf(type[j]) > -1;
                if (isNative) {
                    event = document.createEvent('MouseEvents');
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
                        while (el.nodeType) {
                            listener = el['on'+ type[j]];
                            if (typeof(listener) === 'function') {
                                if (!isNative) {
                                    event.run73 = {target: el};
                                }
                                listener.call(el, event);
                                if (event.isBubblingCanceled) {
                                    break;
                                }
                            }
                            if (el.parentNode === null && !isNative) return this;
                            el = el.parentNode;
                        }
                    }
                }
            }
            return this;
        },
        html: function(str, el) {
            var arr = (el)? [el] : this;
            if (!str && str !== '') {
                return arr[0].innerHTML;
            }
            for (var i=0, il=arr.length; i<il; i++) {
                arr[i].innerHTML = str;
            }
            this.trigger('calculate');
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
                div = document.createElement('div'),
                moveEl,
                movedEl,
                moveAccNr;
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
            this.trigger('calculate');
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
            this.trigger('calculate');
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
            var found = [],
                el;
            selector = selector || '*';
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
        },
        wait: function(msec, callback) {
            var that = this;
            setTimeout(function() {
                callback.call(that);
            }, msec);
            return this;
        }
    };

    // export junior
    root.jr = function() {
        var njr = new Junior();
        return njr.find.apply(njr, arguments);
    };

})(window, document);