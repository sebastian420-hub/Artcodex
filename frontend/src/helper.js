

export function splitMessage(message) {
    let parts = message.split(" "); 
    let followingUser = parts[0];   
    let followedUser = parts[2];   
    
    return { followingUser, followedUser };
  }