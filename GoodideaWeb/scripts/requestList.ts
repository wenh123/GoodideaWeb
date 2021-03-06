﻿app.controller('requestList', async function ($scope, $sce, $uibModal) {
    $scope.bannerList = await goodidea.Banner.getBannerList();

    $scope.classOptions = [{ id: 'N', name: '不分類' }];
    $scope.class = 'N';
    (await goodidea.Class.getClassList()).forEach(x => $scope.classOptions.push(x));

    $scope.keyword = '';

    $scope.loginUser = await goodidea.User.getLoginUser();
    $scope.loadLoginUserSpecialty =async ()=> {
        $scope.keyword = $scope.loginUser.specialty.map(x => x.value);
        await $scope.reload();
        $scope.$apply();
        fixMdlTextfields(document.getElementsByClassName('listController')[0]);
    }

    $scope.orderOptions = [
        { id: goodidea.OrderBy.lastEditTime, name: '最後更新時間' },
        { id: goodidea.OrderBy.name, name: '提案名稱' },
        { id: goodidea.OrderBy.class, name: '提案分類' },
        { id: goodidea.OrderBy.views, name: '瀏覽人次' }
    ];
    $scope.order = goodidea.OrderBy.lastEditTime.toString();
    $scope.$apply();//通知更新

    $scope.lastPageResult = null;
    $scope.projectList = [];
    $scope.loading = false;
    $scope.loadNextPage = async () => {
        $scope.loading = true;
        if ($scope.lastPageResult == null) {
            $scope.lastPageResult = await goodidea.Project.getRequestProjectList(
                $scope.keyword,
                $scope.class == 'N'? null : $scope.class,
                parseInt($scope.order)
            );
        } else {
            $scope.lastPageResult = await $scope.lastPageResult.nextPage();
        }
        
        $scope.lastPageResult.result.forEach(x => {
            if (!x.cover) x.cover = $scope.bannerList[0];
            x.idString = x.id.replace(/\-/g, ''); 
            if ($scope.projectList.filter(y=>y.id == x.id).length == 0)$scope.projectList.push(x);
        });
        $scope.loading = false;
        $scope.$apply();//通知更新    
        fixMdlTooltip(document.getElementsByClassName('android-content')[0]);
    }
    $scope.reload =async () => {
        $scope.lastPageResult = null;
        $scope.projectList = [];
        await $scope.loadNextPage();
        $scope.$apply();//通知更新  
    }
    await $scope.reload();
    $scope.$apply();//通知更新  
    fixMdlTextfields(document.getElementsByClassName('listController')[0]);

     //AutoLoadMore
    var mdlContentElement: HTMLElement = (<HTMLElement>document.getElementsByClassName('mdl-layout__content')[0]);
    $scope.autoload = true;//自動讀取鎖定變數
    mdlContentElement.onscroll = async () => {
        if (mdlContentElement.scrollHeight - mdlContentElement.scrollTop > 1500) return;//作用座標
        if (!$scope.autoload) return;//鎖定時不處理
        $scope.autoload = false;//鎖定
        await $scope.loadNextPage();//讀取
        $scope.autoload = true;//取消鎖定
        $scope.$apply();//通知更新 
    }
});
