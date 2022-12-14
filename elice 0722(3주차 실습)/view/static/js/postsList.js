let listData;


$(document).ready(() => {
    if (localStorage.getItem("page") === null) { //현재 기록된 페이지값 가져오기.
        localStorage.setItem("page", "1");
    }
    localStorage.setItem("page", "1");
    localStorage.removeItem("changeData");
    getList();
});

const getList = () => {
    let page = localStorage.getItem("page"); //페이지 가져오기
    listData = {};
    $(".postsList").empty();
    let totalPage;
    $.ajax({
        methods: "GET",
        url: `http://localhost:8080/posts?page=${page}&perPage=5`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("accessToken", getCookie("accessToken"));
        },
        success: (res) => {
            // console.log(res); //값 가져옴
            listData = res.posts;
            totalPage = res.totalPage;
            listData.map((it, index) => {
                let list = `<tr>
                <th scope="row">${index + 1}</th>
                <td onclick="detailPost('${it.shortId}')"  class="postTitle-btn">${it.title}</td>
                <td>${it.author.name}</td>
                <td>
                <button type="button" class="btn btn-outline-danger" onclick="deleteContent('${it.shortId}')">삭제</button>
                <button type="button" class="btn btn-outline-info" onclick="changeContent('${it.shortId}')">수정</button>
                </td>
                </tr>`
                //생성된 html을 .postsList 클래스에 append 해준다.
                $(".postsList").append(list);
            });
        },
        error: (res) => {
            console.log(res);
            if (res.responseJSON.success === false) {
                delCookie("accessToken")
                alert("로그인 해주세요.");
                location.href = "./../user/login.html";
            }
        },
        complete: () => {

            let firstPage = 0;
            if ((Number(page) - 1) < 1) { //첫번째 페이지인지 체크
                firstPage = 0;
            } else {
                firstPage = (Number(page) - 1);
            }

            let lastPage;

            if (totalPage <= page) { //마지막 페이지인지 체크
                lastPage = null;
            } else {
                lastPage = Number(page) + 1;
            }

            let firstPart;
            let lastPart;

            if (firstPage !== 0) {
                firstPart = `<li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous" onclick="changePage('${firstPage}')">
                            <span aria-hidden="true" >&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#" onclick="changePage('${firstPage}')">${firstPage}</a></li>`;
            } else {
                firstPart = ``;
            }

            if (lastPage !== null) {
                lastPart = `<li class="page-item"><a class="page-link" href="#" onclick="changePage('${lastPage}')">${lastPage}</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next" onclick="changePage('${lastPage}')">
                            <span aria-hidden="true" >&raquo;</span>
                        </a>
                    </li>`;
            } else {
                lastPart = '';
            }


            if (listData.length !== 0) {

                $(".m-pagination").empty();

                let paginationData =
                    `${firstPart}
                    <li class="page-item"><a class="page-link active" href="#">${page}</a></li>
                    ${lastPart}
                    `;

                $(".m-pagination").append(paginationData);


            } else {
                return;
            }
        }
    });
}

const changePage = (page) => {
    localStorage.setItem("page", page);
    getList();
}

const detailPost = (shortId) => {
    let detailData = listData.filter((it) => it.shortId === shortId); //해당하는 아이디 찾고
    window.localStorage.setItem("detailData", JSON.stringify(detailData[0]));
    location.href = "./../posts/detailPost.html";
}


const deleteContent = (shortId) => {
    $.ajax({
        methods: "GET",
        url: "http://localhost:8080/posts/delete/" + shortId,
        data: {
            shortId: sessionStorage.getItem("shortId")
        },
        dataType: 'json',
        success: (res) => {
            if (res.result === 'delete-success') {
                getList();
                return;
            }
        },
        error: (e) => {
            alert("삭제할 수 없는 글입니다.");
        }
    });
}

const changeContent = (shortId) => {
    let changeData = listData.filter((it) => it.shortId === shortId); //해당하는 아이디 찾고

    //그 값을 로컬 스토리지에 저장합니다. //또한 로컬스토리지는 String 형태로 저장되기 때문에 JSON의 String형태로 저장합니다.
    window.localStorage.setItem("changeData", JSON.stringify(changeData[0]));
    location.href = "./../posts/createOrEdit.html";
}

const searchShortId = () => { //shortId에따른 유저 검색

    let shortId = $("#shortId").val();

    let page = localStorage.getItem("page"); //페이지 가져오기
    listData = {};
    $(".postsList").empty();
    let totalPage;
    $.ajax({
        methods: "GET",
        url: `http://localhost:8080/posts/${shortId}/posts?page=${page}&perPage=5`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader("accessToken", getCookie("accessToken"));
        },
        success: (res) => {
            // console.log(res); //값 가져옴
            listData = res.posts;
            totalPage = res.totalPage;
            listData.map((it, index) => {
                let list = `<tr>
                <th scope="row">${index + 1}</th>
                <td onclick="detailPost('${it.shortId}')"  class="postTitle-btn">${it.title}</td>
                <td>${it.author.name}</td>
                <td>
                <button type="button" class="btn btn-outline-danger" onclick="deleteContent('${it.shortId}')">삭제</button>
                <button type="button" class="btn btn-outline-info" onclick="changeContent('${it.shortId}')">수정</button>
                </td>
                </tr>`
                //생성된 html을 .postsList 클래스에 append 해준다.
                $(".postsList").append(list);
            });
        },
        error: (res) => {
            console.log(res);
            if (res.responseJSON.success === false) {
                delCookie("accessToken")
                alert("로그인 해주세요.");
                location.href = "./../user/login.html";
            }
        },
        complete: () => {

            let firstPage = 0;
            if ((Number(page) - 1) < 1) { //첫번째 페이지인지 체크
                firstPage = 0;
            } else {
                firstPage = (Number(page) - 1);
            }

            let lastPage;

            if (totalPage <= page) { //마지막 페이지인지 체크
                lastPage = null;
            } else {
                lastPage = Number(page) + 1;
            }

            let firstPart;
            let lastPart;

            if (firstPage !== 0) {
                firstPart = `<li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous" onclick="searchChangePage('${firstPage}')">
                            <span aria-hidden="true" >&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#" onclick="searchChangePage('${firstPage}')">${firstPage}</a></li>`;
            } else {
                firstPart = ``;
            }

            if (lastPage !== null) {
                lastPart = `<li class="page-item"><a class="page-link" href="#" onclick="searchChangePage('${lastPage}')">${lastPage}</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next" onclick="searchChangePage('${lastPage}')">
                            <span aria-hidden="true" >&raquo;</span>
                        </a>
                    </li>`;
            } else {
                lastPart = '';
            }


            if (listData.length !== 0) {

                $(".m-pagination").empty();

                let paginationData =
                    `${firstPart}
                    <li class="page-item"><a class="page-link active" href="#">${page}</a></li>
                    ${lastPart}
                    `;

                $(".m-pagination").append(paginationData);


            } else {
                return;
            }
        }
    });
}

const searchChangePage = (page) => {
    localStorage.setItem("page", page);
    searchShortId();
}