/**
         * 刷新画布
         *
         * @param {number=} index
         * @param {Shape=} base
         */
        refresh: function (index, base) {

            var me = this;
            var context = getContext(me.shapeCanvas);

            if (base) {
                base.undo(context);
            }

            me.iterator(
                function (shape, index) {
                    shape.index = index;
                    shape.snapshoot = snapshoot(context);
                    shape.draw(context);
                },
                index
            );
        }
        resizeCanvas: function (width, height) {

            var style = 'width:' + width + 'px;'
                      + 'height:' + height + 'px';

            var resize = function (canvas) {
                canvas.style.cssText = style;
                retina(canvas);
            };

            var me = this;

            resize(me.shapeCanvas);
            resize(me.effectCanvas);

        },