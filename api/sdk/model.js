const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // x1 x2 x3
    x1 = (data[0] - 42,794) / 10,60339549
    x2 = (data[1] - 88,509) / 19,06251028
    x3 = (data[2] - 143,127) / 22,86503183
    return [x1, x2, x3]
}

function denormalized(data){
    y1 = (data[0] * 9,20165319) + 74,807
    y2 = (data[1] * 14,85172777) + 49,766
    y3 = (data[2] * 23,85217469) + 160,133
    return [y1, y2, y3]
}


async function predict(data){
    let in_dim = 3;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/rosiana04/bot_jst7/main/public/ex_model/model.json?token=5040677518:AAHV5a_H5BccIpJtYkUSC4GlYsIMTC9hkQw';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
