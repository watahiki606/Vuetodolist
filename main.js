// ローカルストレージAPIの利用
var STRAGE_KEY = "todos-vuejs-demo";
var todoStrage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STRAGE_KEY) || "[]");
    todos.forEach(function(todo, index) {
      todo.id = index;
    });
    todoStrage.uid = todos.length;
    return todos;
  },
  save: function(todos) {
    localStorage.setItem(STRAGE_KEY, JSON.stringify(todos));
  }
};

var app = new Vue({
  el: "#app",
  data() {
    // 使用するデータ
    return {
      //   リストデータ用の空配列をdataオプションに登録する。データがないときでも配列として認識されるようにするため。また、data直下のデータは後から追加できないため初期値で宣言しておく必要がある。
      todos: [],
      options: [
        { value: -1, label: "すべて" },
        { value: 0, label: "作業中" },
        { value: 1, label: "完了" }
      ],
      // 選択しているoptionsのvalueを記憶するためのデータ
      // 初期値をすべてにする
      current: -1
    };
  },
  created() {
    //   インスタンス作成時(いくつかあるがここではcreatedメソッド)にローカルストレージに保存されているデータを自動的に取得
    this.todos = todoStrage.fetch();
  },
  //   computedオプションに加工したデータを返すメソッドを登録する。算出プロパティは元になったデータに変更があるまで結果をキャッシュする。
  computed: {
    // currentデータの選択値によって表示させるリストの内容を振り分けるために「算出プロパティ」機能を使う。
    // 算出プロパティはデータから別の新しいデータを作成する関数型のデータ。
    computedTodos: function() {
      //   currentが - 1なら「すべて」
      //   それ以外はcurrentとstateが一致するものだけに絞り込む
      return this.todos.filter(function(el) {
        return this.current < 0 ? true : this.current === el.state;
      }, this);
    },
    //   valueからlabelへ変換するためのlabels算出プロパティ
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, { [b.value]: b.label });
      }, {});
    }
  },
  //   ウォッチャはデータの変化に反応して予め登録して置いた処理を自動的に行う。
  watch: {
    //     形式:監視するデータ：function ( newVal, oldVal ) { }
    //   オプションを使う場合はオブジェクト形式にする。
    todos: {
      //   引数はウォッチしているプロパティの変更後の値
      handler: function(todos) {
        todoStrage.save(todos);
      },
      //   deepオプションでネストしているデータも監視できる
      deep: true
    }
  },
  methods: {
    // 使用するメソッド
    // フォームのボタンを押すと呼ばれる。TODOを追加する。
    doAdd: function(event, value) {
      // refで名前をつけておいた要素を参照
      var comment = this.$refs.comment;
      // 入力がなければ何もしない
      if (!comment.value.length) {
        return;
      }
      //   { 新しいID、 コメント、 作業状態}
      //   というオブジェクトを現在のtodosリストへpush
      //   作業状態stateはデフォルト0:作業中で作成する
      this.todos.push({
        //   uidは起動時に読み込む,何用？
        id: todoStrage.uid++,
        comment: comment.value,
        state: 0
      });
      //   フォーム要素を空にする
      comment.value = "";
    },
    //   状態変更の処理
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1;
    },
    // 削除処理
    doRemove: function(item) {
      var index = this.todos.indexOf(item);
      // インデックスを取得して１つ削除
      this.todos.splice(index, 1);
    }
  }
});
