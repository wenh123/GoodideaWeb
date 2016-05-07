var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
app.controller('project', function ($scope, $sce, $uibModal) {
    return __awaiter(this, void 0, void 0, function* () {
        $scope.project = null;
        $scope.loginUser = null;
        $scope.voteQuota = 0;
        $scope.loading = false;
        $scope.load = () => __awaiter(this, void 0, void 0, function* () {
            $scope.loading = true;
            $scope.projectId = queryString['id'];
            try {
                $scope.loginUser = yield goodidea.User.getLoginUser(); //取得目前登入使用者
                $scope.project = yield goodidea.Project.getProjectById($scope.projectId); //透過Querystring取得ID後讀取該提案
                if ($scope.loginUser && $scope.project.competition) {
                    $scope.voteQuota = yield goodidea.Competition.getLoginUserQuota($scope.project.competition); //取得剩餘可投票數
                }
                if (!$scope.loginUser)
                    $scope.voteQuota = "0，您尚未登入";
            }
            catch (e) {
                swal({
                    type: 'error',
                    title: "無效的提案ID",
                    text: "您目前的檢視頁面連結是無效的，這可能是因為該提案並未公開且您目前的身分無法檢視(或登入逾時)或已經刪除",
                    confirmButtonText: "確定"
                });
                return;
            }
            $scope.$apply();
            if (!$scope.project.cover)
                $scope.project.cover = (yield goodidea.Banner.getBannerList())[0];
            console.log($scope.project);
            $scope.loading = false;
            $scope.project.htmlContent = $sce.trustAsHtml(markdown.toHtml($scope.project.content));
            $scope.project.segments = $scope.project.getContentSegments().segments;
            if ($scope.project.segments) {
                $scope.project.segments = $scope.project.segments.map(x => {
                    var element = parseNode(markdown.toHtml(x.title));
                    if (element)
                        return {
                            active: false,
                            text: element.innerText
                        };
                });
            }
            $scope.$apply(); //通知更新
            var contentElement = document.getElementsByClassName("nkfust-project-content")[0];
            $scope.tags = [];
            for (var i = 1; i <= 6; i++) {
                contentElement.getElementsByTagName('h' + i.toString()).toArray().forEach((x) => {
                    var aTag = document.createElement('a');
                    aTag.name = x.innerText;
                    $scope.tags.push(aTag);
                    contentElement.insertBefore(aTag, x);
                });
            }
            //#region Segment剖析
            //#endregion
            var mdlContentElement = (document.getElementsByClassName('mdl-layout__content')[0]);
            mdlContentElement.onscroll = function () {
                //#region 更新Segment座標資訊
                for (var i = 0; i < $scope.project.segments.length; i++) {
                    var text = $scope.project.segments[i].text;
                    console.log(text);
                    var element = contentElement.querySelector(`a[name="${text}"]`);
                    $scope.project.segments[i].element = element;
                    $scope.project.segments[i].start = element.getBoundingClientRect().top + mdlContentElement.scrollTop;
                }
                for (var i = 0; i < $scope.project.segments.length; i++) {
                    if (i == $scope.project.segments.length - 1) {
                        $scope.project.segments[i].end = Number.MAX_SAFE_INTEGER;
                        continue;
                    }
                    $scope.project.segments[i].end = $scope.project.segments[i + 1].start;
                }
                //#endregion
                var visableStart = this.scrollTop;
                var visableEnd = this.scrollTop + document.body.clientHeight;
                console.log($scope.project.segments);
                for (var i = 0; i < $scope.project.segments.length; i++) {
                    var segment = $scope.project.segments[i];
                    if (segment.start <= visableStart && segment.end >= visableEnd)
                        segment.active = true;
                    else if (segment.start >= visableStart && segment.start <= visableEnd)
                        segment.active = true;
                    else if (segment.end >= visableEnd && segment.end <= visableEnd)
                        segment.active = true;
                    else if (segment.start >= visableStart && segment.end <= visableEnd)
                        segment.active = true;
                    else
                        segment.active = false;
                }
                $scope.$apply();
            };
            mdlContentElement.onscroll(null);
        });
        $scope.vote = () => __awaiter(this, void 0, void 0, function* () {
            $scope.loading = true;
            try {
                $scope.voteQuota = (yield $scope.project.vote());
            }
            catch (e) {
                $scope.loading = false;
                swal({
                    type: 'error',
                    title: e.name,
                    text: e.message,
                    confirmButtonText: "確定"
                });
                return;
            }
            yield $scope.load(); //更新提案資訊
            $scope.loading = false;
            $scope.$apply();
            swal({
                type: 'success',
                title: "投票成功",
                text: `您已經成功的在競賽「${$scope.project.competition.name}」中針對此提案「${$scope.project.name}」進行投票`,
                confirmButtonText: "確定"
            });
        });
        yield $scope.load();
        $scope.$apply();
    });
});
//# sourceMappingURL=project.js.map