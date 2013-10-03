(function () {

    "use strict";

	var applicationData =  Windows.Storage.ApplicationData.current;
	var localSettings = applicationData.localSettings;
	var startedIndex = {};

	WinJS.Namespace.define("Storage", {

	    setRelationData: setRelationData,
	    getRelationData: getRelationData,
	    deleteRelationData: deleteRelationData,
	    dropTable: dropTable,
	    getTablesName: getTablesName,
	    createTable : createTable,
	    createTables : createTables,
        insertRecordToTable: insertRecordToTable,
        editRecord: editRecord,
        tableExit : tableExit,
	    recordExit : recordExit,
	    getRecordFromTableByIndex: getRecordFromTableByIndex,
	    getLatestRecordsFromTable : getLatestRecordsFromTable,
        getAllRecordFromTable : getAllRecordFromTable,
	    deleteRecordFromTableByIndex : deleteRecordFromTableByIndex,
	    getIndexOfTable: getIndexOfTable,
	    hasRecordByIndex: hasRecordByIndex,
	    getRecordsFromTableSortedNew: getRecordsFromTableSortedNew,
	    setCurrentIndex: setCurrentIndex
    });



	function setRelationData(tablename, source, relatedVideo) {


	    try{
	        var record = createRecordByVideoData(relatedVideo);

	        //参照している動画のnameをキーとしてテーブルを作成
	        if (record) {
	            createTable(source.name);
	            insertRecordToTable(record, tablename);
	        } else {
	            throw new Error('RelationDataを作成できませんでした');
	        }

	    } catch (error) {
	        throw new Error('RelationDataの作成に失敗しました');
	    }
	}

	function getRelationData(name) {
	    return getAllRecordFromTable(name);
	}

	function deleteRelationData(name) {
	    Storage.dropTable(name);
	}

	function createRecordByVideoData(videoData) {

	    var record;

	    switch (videoData.fileType) {

	        case VideoSource.LOCAL_VIDEO:
	            var array = videoData.path.split('\\');
	            var name = array[array.length - 1];
	            var folder = array[array.length - 2];
	            record = { src: videoData.name, folder: folder, name: videoData.displayName, fileType: videoData.fileType };
	            break;

	        case VideoSource.MY_VIDEO:
	            var array = videoData.path.split('\\');
	            var name = array[array.length - 1];
	            var folder = array[array.length - 2];
	            record = { src: videoData.name, folder:folder, name: videoData.displayName, fileType: videoData.fileType };
	            break;

	        case VideoSource.YOUTUBE:
	            record = { src: videoData.information.embed, folder: null, name: videoData.name, fileType: videoData.fileType, screenshot: videoData.information.screenshot };
	            break;

	        default:
	            var array = videoData.path.split('\\');
	            var name = array[array.length - 1];
	            var folder = array[array.length - 2];
	            record = { src: videoData.name, folder: folder, name: videoData.displayName, fileType: videoData.fileType };
	            break;
	    }

	    return record;
	}

	function setCurrentIndex() {
	    getTablesName().forEach(function (tableName) {
	        var index = getIndexOfTable(tableName);
	        startedIndex[tableName] = index;
	    });
	}


	/**
	* @param tableName
	*	String 作成するテーブル名
	* 
	* @return resultStatus
	* 	Boolean テーブル作成がうまくいったかどうか
	*	＊考えられるエラー原因: テーブルがすでに存在する
	**/
	function createTable(tableName){
		var resultStatus = false;

		if (localSettings.containers.hasKey(tableName)) {

			return resultStatus;
		
		} else {
		    var container = localSettings.createContainer(tableName, Windows.Storage.ApplicationDataCreateDisposition.Always);
		    localSettings.containers.lookup(tableName).values["index"] = 0;
		    resultStatus = true;
		    return resultStatus;
		}

	}

    /**
	* @param tableNames
	*	String 作成するテーブル名
	**/
	function createTables(tableNames) {
	    
	    for (var key  in tableNames) {
	        createTable(tableNames[key]);
	    }
	}

	/**
	* テーブルを削除する 
	* @param tableName
	*	String 削除するテーブル名
	* @return
	*	boolean 削除成功したかどうか
	**/
	function dropTable(tableName){
		var resultStatus = false;

		if(localSettings.containers.hasKey(tableName)){
			localSettings.deleteContainer(tableName);
			resultStatus = true;
		}
		
		return resultStatus;
	}


	/**
	* 指定したテーブルからレコードを削除(Indexでレコードを指定) 
	* @param targetIndex, tableName
	*	targetIndex: Integer 削除したいレコードのIndex
	*	tableName: String 対象テーブル名
	* @return
	*	Boolean 削除に成功したかどうか
	**/
	function deleteRecordFromTableByIndex(targetIndex,tableName){
		var resultStatus = false;
		if(localSettings.containers.hasKey(tableName)){
			if(localSettings.containers.lookup(tableName).values[targetIndex]){
				localSettings.containers.lookup(tableName).values.remove(targetIndex);
				resultStatus = true;
			}
		}
		return resultStatus;
	}
				
			
	/**
	* 指定したテーブルにレコードを追加
	* @param recordObj,tableName
	*	recordObj  Object 追加したいレコードオブジェクト(生のオブジェクト)
	*	tableName　String レコードを追加したいテーブル名
	* 
	* @return resultStatus
    *   成功したらIndex
    *   失敗したらfalse
	*	＊考えられるエラー原因: テーブルが存在しない
	**/
	function insertRecordToTable(recordObj,tableName){
		var resultStatus = false;

		if(localSettings.containers.hasKey(tableName)){
			var index = parseInt(localSettings.containers.lookup(tableName).values["index"]);
			recordObj.index = index;
			localSettings.containers.lookup(tableName).values[index] = toAtomic(recordObj);
			localSettings.containers.lookup(tableName).values["index"] = index+1;
			
			resultStatus = recordObj.index;
			return resultStatus;
			 
 		} else{
		
			return resultStatus;	
		
		}		
	}

	function editRecord(recordObj, tableName, index) {
	    var resultStatus = false;
	    if (localSettings.containers.hasKey(tableName)) {
	        if (localSettings.containers.lookup(tableName).values.hasKey(index)) {
	            recordObj.index = index;
	            localSettings.containers.lookup(tableName).values[index] = toAtomic(recordObj);
	            resultStatus = true;
	        }
	    }
	    return resultStatus;
	}

	/**
	* テーブル(コンテナ）が存在するか
	* @param  tableName
	*	String テーブルの名前
	* 
	* @return 	
	*	Boolean テーブルが存在するかどうか	
	*/
	function tableExit(tableName) {
	    return localSettings.containers.hasKey(tableName);
	}


    /**
    * テーブル名をすべて取得する
    *
    * @return
    *   Array : String テーブル名が入った配列
    **/
	function getTablesName() {
	    var resultArray = []
	    for (var prop in localSettings.containers) {
	        if (typeof (localSettings.containers[prop]) === "object") {
	            resultArray.push(prop);
	        }
	    }
	    return resultArray;
	}


	/**
	* レコードが存在するか
	* @param recordIndex,tableName
	*	recordIndex: Integer レコードのIndex
	*	tableName : String 対象テーブル名
	* @return 
	*	Boolean レコードが存在するか
	**/
	function recordExit(recordIndex,tableName){
		return localSettings.containers.hasKey(tableName) && localSettings.containers.lookup(tableName).values.hasKey(recordIndex);
	}
	
	
	/**
	* テーブルからすべてのレコード（object）を取得
	*
	* @param  tableName
	* 	String テーブル(コンテナ）の名前
	*
	* @return resultArray
	*	Array オブジェクトの配列 
	*	（注)テーブルが存在しない場合、レコードが存在しない場合は空の配列が変える
	*/
	function getAllRecordFromTable(tableName){
		var resultArray = [];		
	
		if(localSettings.containers.hasKey(tableName)){

            var i = 0
			for (var prop in localSettings.containers.lookup(tableName).values) {
			    if (typeof (localSettings.containers.lookup(tableName).values[prop]) === "object" && prop != "onmapchanged") {
			        i++;
			        resultArray.push(localSettings.containers.lookup(tableName).values[prop]);
			    }
			}
			
		}

		Debug.writeln(i + "個");
		return resultArray;
	}

	/**
	* 指定されたIndexのレコードを返します
	* @param index,tableName
	*	index: Integer 取得したいレコードのIndex番号
	*	tableName: String 対象テーブル名
	*
	* @return 
	*	指定されIndexのレコード（オブジェクト)
	**/	
	function getRecordFromTableByIndex(index,tableName){
	    var resultObj = null;
	    if (localSettings.containers.hasKey(tableName)) {
	        if (localSettings.containers.lookup(tableName).values.hasKey(index)) {
	            resultObj = localSettings.containers.lookup(tableName).values[index];
	        }
        } else {
			resultObj = null;
		}
		return resultObj;
	}


    /**
    * 指定された数のレコードを新しい順にテーブルから取得します。
    *
    * @param getCount, tableName
    *       getCount: Integer 取得したいレコードの数
    *       tableName: String 対象テーブル名
    *
    * @return
    *   オブジェクト配列
    *       成功： オブジェクト配列
    *       失敗： 空の配列
    **/
	function getLatestRecordsFromTable(getCount, tableName) {
	    var resultArray = [];
	    if (localSettings.containers.hasKey(tableName)) {
	        var index = parseInt(localSettings.containers.lookup(tableName).values["index"]);
	        if (index > getCount) {
	            for (var i = index - 1; i > (index - getCount - 1) ; i--) {
                    if(localSettings.containers.lookup(tableName).values.hasKey(i))
	                    resultArray.push(localSettings.containers.lookup(tableName).values[i]);
	            }
	        } else {

	            for (var i = 0; i < index; i++) {
                    if(localSettings.containers.lookup(tableName).values.hasKey(i))
	                    resultArray.push(localSettings.containers.lookup(tableName).values[i]);
	            }

	        }
	    }

	    return resultArray;
	}

    /**
    * 最新のレコードから指定した数のレコード数を取得します、beginで開始数を指定できます
    *
    **/
	function getRecordsFromTableSortedNew(maxGetCount, tableName, begin) {
	    var resultArray = [];
	    var beginIndex;
	    var lastIndex;
	    var endIndex;
	    if (localSettings.containers.hasKey(tableName)) {
	        var index = parseInt(localSettings.containers.lookup(tableName).values["index"]);
	        lastIndex = index-1;//最後のレコードが入ったIndex
	        beginIndex = lastIndex - begin;
	        endIndex = beginIndex - maxGetCount;

	        if(beginIndex < 0){
	            Debug.writeln("指定した開始地点がレコード数を超えてます(index-begin)が0以下");
	            return [];
	        }
	       
	        for (var i = beginIndex; i > endIndex; i--) {
	            if (localSettings.containers.lookup(tableName).values.hasKey(i))
	                resultArray.push(localSettings.containers.lookup(tableName).values[i]);
	            if (i == 0)
	                break;
	        }

	    }

	    return resultArray;

	}




	/**
	*　テーブルのIndexを返します。
	* @param tableName
	*	String  テーブルの名前（コンテナ名）
	* 
	* @return resultIndex
	*	成功 : Integer テーブルのIndex	
	*	失敗 : null　（テーブルが存在しない場合)
	**/
	function getIndexOfTable(tableName){
		var resultIndex;
		if(localSettings.containers.hasKey(tableName)){
			 resultIndex = parseInt(localSettings.containers.lookup(tableName).values["index"]);
		}
		else{
		  resultIndex = null;
		}
		return resultIndex;
	}	
		
    /**
    * 指定のIndexのレコードが存在するか
    *
    * @param targetIndex,tableName
    *   targetIndex: Integer　Index名
    *   tableName: String テーブル名
    *
    * @return 
    *   Boolean レコードの存在有無
    **/

	function hasRecordByIndex(targetIndex, tableName) {
	  return  localSettings.containers.lookup(tableName).values.hasKey(targetIndex);
	}
	
	/**
	* オブジェクトをApplicationDataに格納できる形に変換します
	*
	* @param  obj
	* 	Object 変換したいオブジェクト
	*
	* @return atomicedObjct
	* 	ApplicationDataに格納できる形のオブジェクト
	**/	
	function toAtomic(obj){
		var atomiced = new Windows.Storage.ApplicationDataCompositeValue();
		
		for(var prop in obj){
			atomiced[prop] = obj[prop];
		}
		

		return atomiced;
	}



})();	
