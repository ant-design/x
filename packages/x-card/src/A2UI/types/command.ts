enum CommandType {
  Create = 0,
  UpdateCard = 1,
  UpdateData = 2,
  Delete = 3,
}
export interface Command {
  type: `${CommandType}`;
}
