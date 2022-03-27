

class PromptModuleAPI{
    constructor(creator){
        this.creator = creator;
    }
    injectFeature(feature){
        //向feature数组里面加入一个选项
        this.creator.featurePrompt.choices.push(feature)
    }
    injectPrompt(prompt){
        this.creator.injectedPrompts.choices.push(prompt)
    }
    //选择完之后的回调
    onPromptComplete(cb){
        this.creator.promptCompleteCbs.push(cb)
    }
}

module.exports = PromptModuleAPI