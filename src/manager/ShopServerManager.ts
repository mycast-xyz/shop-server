import { ServerController } from '../controller/ServerController';
import { IUserModel } from '../models/IUserModel';

export class ShopServerManager extends ServerController {
  public constructor(userModel: IUserModel) {
    super(userModel);

    this.post('/:hash/reward/stream', async (req, res) => {
      let hash = req.params.hash;
      let reward = req.body.reward;
      if (reward <= 0) {
        res.send('fail');
        return;
      }
      console.log(`ShopServerManager: POST ${hash}/reward/stream/ `, reward);

      let result = await this.mUserModel.rewardCoin(hash, reward);
      if (result) {
        this.refreshCurrentCoin(hash);
        this.sendMessage(hash, 'streamreward', reward);
        res.send('ok');
      } else {
        res.send('fail');
      }
    });

    this.get('/:hash/chatreward/', async (req, res) => {
      let hash: string = req.params.hash;
      let reward = 1;

      let result = await this.mUserModel.rewardCoin(hash, reward);
      if (result) {
        this.refreshCurrentCoin(hash);
        this.sendMessage(hash, 'chatreward');
        res.send('ok');
      } else {
        res.send('fail');
      }
    });

    this.post('/:hash/bitcoin/', (req, res) => {
      //	let
    });
  }
}
