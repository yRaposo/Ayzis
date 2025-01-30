const requestQueue = [];
let isProcessingQueue = false;

const processQueue = () => {
    if (requestQueue.length === 0) {
        isProcessingQueue = false;
        return;
    }

    isProcessingQueue = true;
    const { requestFn, resolve, reject } = requestQueue.shift();

    requestFn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
            setTimeout(processQueue, 340); // 333ms interval to ensure 3 requests per second
        });
};

const addToQueue = (requestFn) => {
    return new Promise((resolve, reject) => {
        requestQueue.push({ requestFn, resolve, reject });

        if (!isProcessingQueue) {
            processQueue();
        }
    });
};
