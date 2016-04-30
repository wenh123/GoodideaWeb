var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
console.log3D = (value) => {
    console.log("%c" + value, "text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:20pt");
};
goodidea.origin = location.origin; //設定允許域
(() => __awaiter(this, void 0, void 0, function* () {
    console.clear();
    console.log3D("創意創新雲端平台");
    console.info("SDK版本: " + goodidea.version);
    var loginUser = yield goodidea.User.getLoginUser();
    console.info("目前登入帳戶: " + (loginUser ? loginUser.id : "<未登入>"));
    console.warn("請注意，這是專門提供給開發人員的瀏覽器功能。您在此處的操作將有可能影響到您在平台上的資料，請謹慎使用。");
}))();
//# sourceMappingURL=main.js.map