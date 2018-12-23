var ListView = (function ($){
    function toogleClass(el,color1,color2){
        if(el.hasClass(color1)){
            el.removeClass(color1);
            el.addClass(color2);
        }else {
            el.removeClass(color2);
            el.addClass(color1);
        }                
    }

    var Component = function(element,options){
        this.element = element;
        this.optionalEvents = options || {};
    }

    Component.prototype.init = function(data){
        this.unsubscribeEvents();
        this.createContainer();
        if(data){
            this.loadData(data);
        }
        this.subscribeEvents();
    }

    Component.prototype.unsubscribeEvents = function(){
        this.element.off('click');
        this.element.off('onItemAdded');
    }

    Component.prototype.subscribeEvents = function(){
        this.element.on('click',this.defaultEvents.onClick.bind(this));
        if(this.optionalEvents.onItemAdded){
            this.element.on('onItemAdded',this.optionalEvents.onItemAdded);
        }
    }

    Component.prototype.defaultEvents = {
        onClick:function(event,data){
            var targetEl = $(event.target);
            var boxEl = $(event.currentTarget);
            var itemEl = targetEl.closest('li[data-id]');
            var xButtonEl = targetEl.closest('a.x_button');
            if(targetEl.attr('id') == boxEl.attr('id')){
                this.boxClickHandler(targetEl);
            }else if(xButtonEl.is('.x_button')){
                this.xButtonClickHandler(event,xButtonEl);
            }else if(itemEl.is('.item')){
                this.itemClickHandler(itemEl);
            }
        }
    }    

    Component.prototype.triggerEvent = function(nameEvent,data){
        this.element.trigger(nameEvent,data)
    }

    Component.prototype.boxClickHandler = function(itemElement){
        toogleClass(itemElement,'bg-green','bg-blue');
    }

    Component.prototype.itemClickHandler = function(itemElement){
        toogleClass(itemElement,'bg-green','bg-red');
    }

    Component.prototype.xButtonClickHandler = function(e,itemElement){
        e.preventDefault();
        itemElement.closest('li').remove();
    }

    Component.prototype.loadData = function(data){
        var that = this;
        this.lastIndexDataId = 1;
        data.forEach(function(text){
            if(text && text.trim()){
                that.addNew(text);
            }
        });
    }

    Component.prototype.createContainer = function(){
        var container = $('<ul></ul>').clone();
        this.container = container;
        this.element.append(container);
    }

    Component.prototype.addNew = function(text){
        var element = this.templates.item.clone();        
        var dataId = this.lastIndexDataId;
        this.lastIndexDataId++;
        element.attr('data-id',dataId);
        element.addClass('bg-green');

        var spanElement = this.templates.content.clone();
        spanElement.html(text);
        var spanX = this.templates.xButton.clone();
    
        element.append(spanElement);
        element.append(spanX);
        this.element.find('ul').append(element);

        this.triggerEvent('onItemAdded',{id:dataId,text:text});
    }
    
    Component.prototype.templates = {
        item:$('<li class="item"></li>'),
        content:$('<span class="x_content"></span>'),
        xButton:$('<a href="#" class="x_button" style="float:right">X</a>')
    }

    function Wrapper(component,data){
        component.init(data);

        function addNew(text){
            if(!text || !text.trim()){
                return;
            }
            component.addNew(text);
        }
        // Public API
        return {
            addNew:addNew
        }
    }

    function create(element,data,options){
        var component = new Component(element,options);
        return new Wrapper(component,data);
    }
    return {
        create:create,
    };
})(jQuery);