exports.handler = (event, context, callback) => {
    console.log(event + 'asdasdasd');
    console.log(context);

    callback(null, {
        statusCode: 200,
        body: 'OK'
      });
}