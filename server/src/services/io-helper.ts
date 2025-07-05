let ioInstance: any;

export const setIO = (io: any) => (ioInstance = io);
export const getIO = () => ioInstance;
