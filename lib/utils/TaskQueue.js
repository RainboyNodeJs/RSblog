/*============================================================================
* Title : task queue
* Author: Rainboy
* Time  : 2016-06-14 09:34
* update: 2016-06-14 09:34
* © Copyright 2016 Rainboy. All Rights Reserved.
*=============================================================================*/

var chalk = require('chalk');


/*=========== colorful debugStr ======= */
var beginStr = chalk.bold.green.bgBlue.underline('[ Begin ]')+chalk.red.bold(':');
var doneStr = chalk.bold.green.bgBlue.underline('[  Done ]')+chalk.red.bold(':');
var cyan = chalk.cyan;

/*=========== colorful debugStr END ======= */



var EventEmitter = require("events").EventEmitter;

var nextTick = global.setImmediate === undefined ? process.nextTick : global.setImmediate;


/* *
 * @constructor
 * @param queueCount
 * */
var TaskQueue = function(queueCount){
    var self= this;
    this.queueCount = queueCount;
    this.emitter = new EventEmitter();
    this.processedCount = 0;

    // default queueCount = 1
    if(undefined === queueCount){
        this.queueCount =1;
    }

    /* 监听器 */
    this.emitter.on('done',function(queueId,debugStr){
        queueId = parseInt(queueId);
        if(isNaN(queueId)) return ;
        if(queueId >= self.queueCount || queueId <0 ) return ;

        if(debugStr){
            var logStr = doneStr;
            for(var i =0;i<self.queue.length;i++){
                if(i !== 0) logStr+=',';
                logStr += cyan('[') + self.queue[i].length+cyan(']');
                
            }
			console.log(logStr);
        }

        nextTick(function(){
            self._runTask(queueId);
        });

    });

    // init the task queue into a
    // two-dimensional array
    this.queue = [];
    this.running = [];
    for(var i =0;i <this.queueCount;i++){
        this.queue.push([]);
        this.running.push(false);
    }
    
    // signal after finish
    this.afterFinshCount = -1;
    this.afterFinshLoop = false;
    this.afterFinshProcessor = undefined;
};


/**
 * return the number processed tasks
 */
TaskQueue.prototype.numberOfProcessed = function() {
    return this.processedCount;
};

/**
 * reset the number of processed tasks
 */
TaskQueue.prototype.resetNumberOfProcessed = function() {
    this.processedCount = 0;
};


/**
 * Run a task in a certain queue.
 * 
 * @param queueId   The queue id
 * @private
 */
TaskQueue.prototype._runTask = function(queueId) {
    // no task in this queue.
    if(!this.queue[queueId].length) {
        this.running[queueId] = false;
        return;
    }

    this.running[queueId] = true;

    // get the task.
    var task = this.queue[queueId].shift();

    // run this task.
    task.processor({ queueId: queueId, task: task.task });

    task.processor = undefined;
    task.task = undefined;
};


/**
 * Push a task into the queue
 *
 * @param task          A task sign - it can be a string, number, etc.
 * @param processor     The processor to process this task
 *                      It will be called like `processor(task)`
 * @param [debugStr]    If true, then it will print the debug string
 *                      to the `stdout`
 */
TaskQueue.prototype.push = function(task, processor, debugStr) {
    // choose a minimum queue
    var min = 0;
    for(var i = 1; i < this.queueCount; i++) {
        if(this.queue[i].length < this.queue[min].length) {
            min = i;
        }
    }

    // push the task into queue
    this.queue[min].push({
        queueId     : min,
        task        : task,
        processor   : processor
    });

    if(debugStr) {
        var logStr = "( Pushed: ";
        for(var i = 0; i < this.queue.length; i++) {
            if(i !== 0) logStr += ", ";
            logStr += "[" + this.queue[i].length + "]";
        }
        logStr += " )";
        console.log(logStr);
    }

    // when no task running in this queue,
    // run the task.
    var self = this;
    if(!this.running[min]) {
        this.running[min] = true;
        nextTick(function() {
            self._runTask(min);
        });
    }
};

/**
 * Finish one task
 *     This function will be called in the `processor` when the
 *     processor done every thing for one task.
 *
 * @param taskObject    The task object passed in `processor`
 * @param [debugStr]    If true, then it will print the debug string
 *                      to the `stdout`
 */
TaskQueue.prototype.taskDone = function(taskObject, debugStr) {
    var self = this;

    nextTick(function() {
        self.emitter.emit("done", taskObject.queueId, debugStr);
    });

    this.processedCount++;

    // after finish
    // 这个应该是有问题的代码
    var needRunFinish = false;
    if(this.afterFinishLoop) needRunFinish = !(this.processedCount % this.afterFinishCount);
    else needRunFinish = (this.processedCount === this.afterFinishCount);
    if(needRunFinish && this.processedCount !== -1 && typeof this.afterFinishProcessor === "function") {
        this.afterFinishProcessor();
        if(!this.afterFinishLoop) this.clearAfterFinish();
    }
};

/**
 * set after finish processor
 * @param count
 * @param processor
 * @param [loop]
 */
TaskQueue.prototype.afterFinish = function(count, processor, loop) {
    this.afterFinishCount = count;
    this.afterFinishLoop = !!loop;
    this.afterFinishProcessor = processor;
};

/**
 * clear after finish processor
 */
TaskQueue.prototype.clearAfterFinish = function() {
    this.afterFinishCount = -1;
    this.afterFinishLoop = false;
    this.afterFinishProcessor = undefined;
};

module.exports = TaskQueue;
