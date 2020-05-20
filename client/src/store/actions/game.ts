export const calcL = (val: number): {type: string; payload: {val: number}} => {
  return {
    type: 'calc_l',
    payload: {
      val
    }
  };
};

export const SET_SESSION_ID = (val: string): {type: string; payload: {val: string}} => {
  return {
    type: 'SET_SESSION_ID',
    payload: {
      val
    }
  };
};

export const CHANGE_SIZE = (key: string, val: number): {type: string; payload: {key: string; val: number}} => {
  return {
    type: 'CHANGE_SIZE',
    payload: {
      key,
      val
    }
  };
};

export const SET_COUNTER = (val: number): {type: string; payload: {val: number}} => {
  return {
    type: 'SET_COUNTER',
    payload: {
      val
    }
  };
};
export const SET_BOXES = (key: string, val: number): {type: string; payload: {key: string; val: number}} => {
  return {
    type: 'SET_BOXES',
    payload: {
      key,
      val
    }
  };
};


export const NEXT_MOVE = (val: string): {type: string; payload: {val: string}} => {
  return {
    type: 'NEXT_MOVE',
    payload: {
      val
    }
  };
};

export const SET_COORDS = (coords: string, history: string): {type: string; payload: {coords: string; history: string}} => {
  return {
    type: 'SET_COORDS',
    payload: {
      coords,
      history,
    }
  };
};

export const COUNT_BOXES = (key: string): {type: string; payload: {key: string}} => {
  return {
    type: 'COUNT_BOXES',
    payload: {
      key,
    }
  };
};

export const IS_VICTORY = (name: string): {type: string; payload: {name: string} } => {
  return {
    type: 'IS_VICTORY',
    payload: {
      name
    }
  };
};

export const START_GAME = (): {type: string} => {
  return {
    type: 'START_GAME',
  };
};

export const RESTART_GAME = (): {type: string} => {
  return {
    type: 'RESTART_GAME',
  };
};

export const GET_SCORES = (): {type: string; payload: {path: string; typed: string}} => {
  return {
    type: 'GET_SCORES',
    payload: {
      path: '/game/scores',
      typed: 'SAVE_SCORES'
    }
  };
};

export const SAVE_SCORES = (data: {[key: string]: string}): {type: string; payload: {data: {[key: string]: string}}} => {
  return {
    type: 'SAVE_SCORES',
    payload: {
      data,
    }
  };
};

export const GET_GAMES = (): {type: string; payload: {path: string; typed: string}} => {
  return {
    type: 'GET_GAMES',
    payload: {
      path: '/game/games',
      typed: 'SAVE_GAMES'
    }
  };
};

export const SAVE_GAMES = (data: {[key: string]: string}): {type: string; payload: {data: {[key: string]: string}}} => {
  return {
    type: 'SAVE_GAMES',
    payload: {
      data,
    }
  };
};

export const SET_MESSAGES = (data: {[key: string]: string}): {type: string; payload: {data: {[key: string]: string}}} => {
  return {
    type: 'SET_MESSAGES',
    payload: {
      data,
    }
  };
};