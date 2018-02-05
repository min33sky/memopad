import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String,
    created: { type: Date, default: Date.now }
});

// generates hash
Account.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
}

// compares the password
Account.methods.validateHash = function (password) {
    return bcrypt.compareSync(password, this.password);
}


// Schema는 틀, Model은 실제 DB에 접근할 수 있게 해주는 클래스
// 첫 번째 인수는 collection name이고 자동으로 복수형 설정이 된다
export default mongoose.model('account', Account);