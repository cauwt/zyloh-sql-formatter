CREATE OR REPLACE PROCEDURE SP_A_OG_BILL_APPROVAL_INFO_DETAIL_DAY
(
    in_data_date IN NVARCHAR2,
    out_run_flag OUT NUMBER,
    out_message_text OUT NVARCHAR2
) IS

   /*====================================================================================================================+
   版权信息: 版权所有(c) 2023，中仑科技集团
   作业名称: ads.sp_a_og_bill_approval_info_detail_day
   责任人员: 王韬
   功能描述: 各单据审批信息明细日报表 数据加工
   需求来源: 系统应用开发部
   目标表名: ads.a_og_bill_approval_info_detail_day
   源表名称: ods.o_crm_paez_t_syjfk_entry113509|ods.o_crm_paez_t_salesforecast|ods.o_crm_paez_t_cust_entry111517|
             ods.o_crm_paez_t_sjxx_entry113014|ods.o_crm_t_wf_pibimap|ods.o_crm_v_wf_procinstm|
             ods.o_crm_v_wf_actinstmg|ods.o_crm_v_wf_assignmg|ods.o_crm_v_wf_receivermg|ods.o_crm_t_sec_user|
             ods.o_crm_t_bd_department_l|ods.o_crm_t_bd_staff_l|ods.o_crm_v_wf_approvalassignmg|
             ods.o_crm_v_wf_approvalitemmg|ods.o_crm_t_bd_staffpostinfo|
             ods.o_eas_t_sd_saleorder|ods.o_eas_t_sd_postrequisition|ods.o_eas_t_wfr_assignview|
             ods.o_eas_t_wfr_procinstview|ods.o_eas_t_bd_person|ods.o_eas_t_bd_customer|ods.o_dsr_auto_1h4d2m8f6
   版本号码: v1.0
   备注信息: 
   上线日期: 2024/11/13
   修改历史: 
   版本号码        更改日期        更改人员        更改说明
   v1.0         2024/11/13        王韬             新增 各单据审批信息明细日报表
  =======================================================================================================================*/

    --变量申明
    p_data_date NVARCHAR2(10);                                                                      --数据批次日期
    p_pro_name NVARCHAR2(128);                                                                      --程序名称
    p_location NVARCHAR2(512);                                                                      --程序执行位置
    p_data_count NUMBER(22,0);                                                                      --程序影响行数
    p_run_flag NVARCHAR2(1);                                                                        --程序返回标识
    p_message_text NVARCHAR2(1024);                                                                 --程序执行SQLCODE
    p_start_date NVARCHAR2(30);                                                                     --程序跑批时间

BEGIN
    --变量定义
    p_pro_name:='ads.sp_a_og_bill_approval_info_detail_day';                                        --程序名称
    p_data_count:=0;                                                                                --程序影响行数
    p_run_flag:='0';                                                                                --程序执行结果值
    p_message_text:='Processing';                                                                   --程序执行SQLCODE
    p_start_date:=TO_CHAR(SYSDATE,'YYYY-MM-DD HH24:MI:SS');                                         --程序跑批时间
    p_data_date:=TO_CHAR(TO_DATE(in_data_date,'YYYY-MM-DD'),'YYYY-MM-DD');                          --数据批次日期
    out_run_flag:='0';                                                                              --程序正常执行返回值
    out_message_text:='';                                                                           --程序正常执行返回结果

    --开启并行执行
    EXECUTE IMMEDIATE 'alter session enable parallel dml';

    p_location:='01.Begin_Program';
    --获取程序执行日志信息
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --删除临时表
    p_location:='02.1.Delete_Temp_Table';
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_BILL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_APPROVAL_DETAIL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_APPROVAL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_PROC_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_APPROVER_FLAT_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_BILL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_SALES_STAFF_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_APPROVAL_DETAIL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_APPROVAL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_PROC_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_APPROVER_FLAT_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_TMP',p_run_flag);
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：CRM-单据数据
    p_location:='03.1.create_a_og_bill_approval_info_detail_day_crm_bill_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_crm_bill_tmp ON COMMIT PRESERVE ROWS AS
    SELECT t1.fid                                                                                   --业务id
           ,t1.fbillno AS bill_number                                                               --单据编号
           ,''CRM送样申请及反馈单'' AS recpt                                                        --单据名称
           ,t3.fname AS cust_name                                                                   --客户名称
           ,t2.fstaffid AS staff_id                                                                 --销售id
           ,t2.fnumber AS staff_number                                                              --销售编码
           ,t1.fsaledepid AS fsaledepid                                                             --销售部门id
           ,t1.fcreatedate AS bill_createtime                                                       --单据创建时间
           ,CASE WHEN t1.fdocumentstatus=''A'' THEN ''创建'' 
                 WHEN t1.fdocumentstatus=''B'' THEN ''审核中'' 
                 WHEN t1.fdocumentstatus=''C'' THEN ''已审核''
                 WHEN t1.fdocumentstatus=''D'' THEN ''重新审核'' 
                 WHEN t1.fdocumentstatus=''E'' THEN ''流程终止'' 
                 WHEN t1.fdocumentstatus=''Z'' THEN ''暂存''
            END AS bill_status                                                                      --单据状态
      FROM ods.o_crm_paez_t_syjfk_entry113509 t1
      LEFT JOIN ods.o_crm_t_bd_staff t2
         ON t1.fstaffid=t2.fstaffid
       AND t1.data_date=t2.data_date
      LEFT JOIN ods.o_crm_t_bd_customer_l t3
         ON t1.fcustid=t3.fcustid
       AND t3.flocaleid=2052
       AND t1.data_date=t3.data_date
     WHERE t1.data_date='''||p_data_date||'''
       AND t1.fdocumentstatus in(''B'',''C'',''D'')
     UNION ALL
    SELECT t1.fid                                                                                   --业务id
           ,t1.fbillno AS bill_number                                                               --单据编号
           ,''CRM销售备货单'' AS recpt                                                              --单据名称
           ,t3.fname AS cust_name                                                                   --客户名称
           ,t2.fstaffid AS staff_id                                                                 --销售id
           ,t2.fnumber AS staff_number                                                              --销售编码
           ,t1.f_paez_department AS fsaledepid                                                      --销售部门id
           ,t1.fcreatedate AS bill_createtime                                                       --单据创建时间
           ,CASE WHEN t1.fdocumentstatus=''A'' THEN ''创建'' 
                 WHEN t1.fdocumentstatus=''B'' THEN ''审核中'' 
                 WHEN t1.fdocumentstatus=''C'' THEN ''已审核'' 
                  WHEN t1.fdocumentstatus=''D'' THEN ''重新审核'' 
                 WHEN t1.fdocumentstatus=''E'' THEN ''流程终止'' 
                 WHEN t1.fdocumentstatus=''Z'' THEN ''暂存''
              END AS bill_status                                                                    --单据状态
      FROM ods.o_crm_paez_t_salesforecast t1
      LEFT JOIN ods.o_crm_t_bd_staff t2
         ON t1.f_paez_salesperson=t2.fstaffid
       AND t1.data_date=t2.data_date
      LEFT JOIN ods.o_crm_t_bd_customer_l t3
         ON t1.f_paez_customer=t3.fcustid
       AND t3.flocaleid=2052
       AND t1.data_date=t3.data_date
     WHERE t1.data_date='''||p_data_date||'''
       AND t1.fdocumentstatus in(''B'',''C'',''D'')
     UNION ALL
    SELECT t1.fid                                                                                   --业务id
           ,t1.fbillno AS bill_number                                                               --单据编号
           ,''CRM用户标识变更单'' AS recpt                                                          --单据名称
           ,t4.fname AS cust_name                                                                   --客户名称
           ,t3.fstaffid AS staff_id                                                                 --销售id
           ,t3.fnumber AS staff_number                                                              --销售编码
           ,t1.fsaldeptid AS fsaledepid                                                             --销售部门id
           ,t1.fcreatedate AS bill_createtime                                                       --单据创建时间
           ,CASE WHEN t1.fdocumentstatus=''A'' THEN ''创建'' 
                 WHEN t1.fdocumentstatus=''B'' THEN ''审核中'' 
                 WHEN t1.fdocumentstatus=''C'' THEN ''已审核'' 
                  WHEN t1.fdocumentstatus=''D'' THEN ''重新审核'' 
                 WHEN t1.fdocumentstatus=''E'' THEN ''流程终止'' 
                 WHEN t1.fdocumentstatus=''Z'' THEN ''暂存''
              END AS bill_status                                                                    --单据状态
      FROM ods.o_crm_paez_t_cust_entry111517 t1
      LEFT JOIN ods.o_crm_t_bd_customer t2
         ON t1.fcustomer=t2.fcustid
       AND t1.data_date=t2.data_date
      LEFT JOIN ods.o_crm_v_bd_salesman t3
         ON t2.fseller=t3.fid
       AND t1.data_date=t3.data_date
      LEFT JOIN ods.o_crm_t_bd_customer_l t4
         ON t2.fcustid=t4.fcustid
       AND t4.flocaleid=2052
       AND t1.data_date=t4.data_date
     WHERE t1.data_date='''||p_data_date||'''
       AND t1.fdocumentstatus in(''B'',''C'',''D'')
     UNION ALL
    SELECT t1.fid                                                                                   --业务id
           ,t1.fbillno AS bill_number                                                               --单据编号
           ,''CRM商机信息'' AS recpt                                                                --单据名称
           ,t4.fname AS cust_name                                                                   --客户名称
           ,t3.fstaffid AS staff_id                                                                 --销售id
           ,t3.fnumber AS staff_number                                                              --销售编码
           ,t1.f_saledeptid AS fsaledepid                                                           --销售部门id
           ,t1.f_createdate AS bill_createtime                                                      --单据创建时间
           ,CASE WHEN t1.fbillstatus=''A'' THEN ''创建'' 
                 WHEN t1.fbillstatus=''B'' THEN ''审核中'' 
                 WHEN t1.fbillstatus=''C'' THEN ''已审核'' 
                 WHEN t1.fbillstatus=''D'' THEN ''重新审核'' 
                  WHEN t1.fbillstatus=''E'' THEN ''关闭'' 
                 WHEN t1.fbillstatus=''F'' THEN ''反关闭'' 
                 WHEN t1.fbillstatus=''G'' THEN ''流程终止'' 
                 WHEN t1.fbillstatus=''Z'' THEN ''暂存''
              END AS bill_status                                                                    --单据状态
      FROM ods.o_crm_paez_t_sjxx_entry113014 t1
      LEFT JOIN ods.o_crm_t_bd_customer t2
        ON t1.fcustid=t2.fcustid
       AND t1.data_date=t2.data_date
      LEFT JOIN ods.o_crm_v_bd_salesman t3
         ON t2.fseller=t3.fid
       AND t1.data_date=t3.data_date
      LEFT JOIN ods.o_crm_t_bd_customer_l t4
         ON t2.fcustid=t4.fcustid
       AND t4.flocaleid=2052
       AND t1.data_date=t4.data_date
     WHERE t1.data_date='''||p_data_date||'''
       AND t1.fbillstatus in(''B'',''C'',''D'')'
    ;

    --获取临时表装载数据执行日志信息
    p_location:='03.2.Insert_a_og_bill_approval_info_detail_day_crm_bill_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：CRM-审批明细
    p_location:='04.1.create_a_og_bill_approval_info_detail_day_crm_approval_detail_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_crm_approval_detail_tmp ON COMMIT PRESERVE ROWS AS
    SELECT t1.recpt                                                                                 --单据名称
           ,t9.fname AS sales_name                                                                  --销售代表
           ,CASE WHEN t8.fname LIKE ''%-%'' THEN SUBSTR(t8.fname,INSTR(t8.fname,''-'',-1,1)+1)
                 ELSE t8.fname
             END AS department                                                                      --销售部门 
           ,CASE WHEN t8.fname LIKE ''%-%'' THEN SUBSTR(t8.fname,1,INSTR(t8.fname,''-'',1,1)-1)
                 ELSE t8.fname
                 END AS center                                                                      --中心
           ,t1.bill_number                                                                          --单据号
           ,t3.fprocinstid AS procinstid                                                            --流程实例编号     
           ,t4.factivityid                                                                          --节点在流程图中的编号
           ,t4.factinstid AS actinstid                                                              --活动实例ID
           ,t13.fname AS proc_submitter                                                             --流程提交人
           ,t1.cust_name                                                                            --客户名称
           ,t1.bill_status                                                                          --单据状态
           ,t1.bill_createtime                                                                      --单据创建时间
           ,t3.fcreatetime AS proc_start_time                                                       --流程开始时间
           ,t3.fcompletetime AS proc_finish_time                                                    --流程结束时间 
           ,t4.fcreatetime AS approval_start_time                                                   --审批开始时间(节点创建时间)
           ,t11.fcompletedtime AS approval_finish_time                                              --审批完成时间(节点结束时间)
           ,t7.fname AS approver                                                                    --流程节点审批人
           ,t10.fdisposition as approval_result                                                     --审批结果
      FROM ads.a_og_bill_approval_info_detail_day_crm_bill_tmp t1
      LEFT JOIN(
		        SELECT fprocinstid
	                   ,fkeyvalue
                       ,CASE WHEN fobjecttypeid=''8244fbb8f19047f2b3869178e55fc5e8'' THEN ''CRM商机信息'' 
                             WHEN fobjecttypeid=''PAEZ_JYCRM_SendSample'' THEN ''CRM送样申请及反馈单'' 
                             WHEN fobjecttypeid=''PAEZ_JYCRM_CustStatusChange'' THEN ''CRM用户标识变更单'' 
                             WHEN fobjecttypeid=''PAEZ_JYCRM_Salesforecast'' THEN ''CRM销售备货单'' 
                          END AS recpt                                                              --单据名称
	              FROM ods.o_crm_t_wf_pibimap 
	              WHERE data_date='''||p_data_date||''' 
	                AND fobjecttypeid IN(''8244fbb8f19047f2b3869178e55fc5e8'',''PAEZ_JYCRM_SendSample'',''PAEZ_JYCRM_CustStatusChange'',''PAEZ_JYCRM_Salesforecast'')
	           )t2
        ON t1.fid=t2.fkeyvalue
       AND t1.recpt=t2.recpt
      LEFT JOIN ods.o_crm_v_wf_procinstmg t3
        ON t2.fprocinstid=t3.fprocinstid
       AND t3.fstatus<>''4''
       AND t3.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_v_wf_actinstmg t4
        ON t3.fprocinstid=t4.fprocinstid
       AND t4.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_v_wf_assignmg t5
        ON t4.factinstid=t5.factinstid
       AND t5.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_v_wf_receivermg t6
        ON t5.fassignid=t6.fassignid
       AND t6.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_t_sec_user t7
        ON t6.freceiverid=t7.fuserid
       AND t7.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_t_bd_department_l t8
        ON t1.fsaledepid=t8.fdeptid
       AND t8.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_t_bd_staff_l t9
        ON t1.staff_id=t9.fstaffid
       AND t9.flocaleid=2052
       AND t9.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_v_wf_approvalassignmg t10
        ON t5.fassignid=t10.fassignid
       AND t10.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_v_wf_approvalitemmg t11
        ON t10.fapprovalassignid=t11.fapprovalassignid 
       AND t6.freceiverid =t11.freceiverid 
       AND t11.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_t_bd_staffpostinfo t12
        ON t1.staff_id=t12.fstaffid
       AND t12.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_crm_t_sec_user t13
        ON t3.data_date=t13.data_date
       AND t3.foriginatorid=t13.fuserid
     WHERE 1=1
       AND t7.ftype=''1''
       AND t11.fstatus<>3
       AND NVL(REPLACE(t12.fisfirstpost,'' '',''''),''处理状态为空'')=''1'''
    ;

    --获取临时表装载数据执行日志信息
    p_location:='04.2.Insert_a_og_bill_approval_info_detail_day_crm_approval_detail_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：CRM-汇总审批节点
    p_location:='05.1.create_a_og_bill_approval_info_detail_day_crm_approval_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_crm_approval_tmp ON COMMIT PRESERVE ROWS AS
    SELECT recpt                                                                                    --单据名称
           ,department                                                                              --销售部门
           ,center                                                                                  --中心
           ,sales_name                                                                              --销售代表
           ,bill_number                                                                             --单据号
           ,bill_status                                                                             --单据状态
           ,cust_name                                                                               --客户名称
           ,proc_submitter                                                                          --流程提交人
           ,procinstid                                                                              --流程实例ID
           ,proc_start_time                                                                         --流程创建时间
           ,proc_finish_time                                                                        --流程结束时间
           ,actinstid                                                                               --流程节点ID(活动实例ID)
           ,merged_approvers                                                                        --节点审批人
           ,approval_start_time                                                                     --审批开始时间(节点创建时间)
           ,approval_finish_time                                                                    --审批完成时间(节点结束时间)
           ,ROUND((NVL(approval_finish_time,SYSDATE)-approval_start_time)*24,2) AS approval_time_tot_cnt --节点审批时长
           ,ROW_NUMBER() OVER(PARTITION BY recpt,bill_number,procinstid ORDER BY approval_finish_time) AS rn --正向排序
           ,ROW_NUMBER() OVER(PARTITION BY recpt,bill_number,procinstid ORDER BY approval_finish_time DESC) AS rn_desc --反向排序
    FROM ( SELECT recpt                                                                             --单据名称
                   ,department                                                                      --销售部门
                   ,center                                                                          --中心
                   ,sales_name                                                                      --销售代表
                   ,bill_number                                                                     --单据号
                   ,bill_status                                                                     --单据状态
                   ,cust_name                                                                       --客户名称
                   ,proc_submitter                                                                  --流程提交人
                   ,procinstid                                                                      --流程实例ID
                   ,proc_start_time                                                                 --流程创建时间
                   ,proc_finish_time                                                                --流程结束时间
                   ,actinstid                                                                       --流程节点ID(活动实例ID)
                   ,LISTAGG(approver,'','') WITHIN GROUP (ORDER BY NVL(approval_finish_time,SYSDATE)) AS merged_approvers --节点审批人
                   ,MIN(approval_start_time) AS approval_start_time                                 --审批开始时间(节点创建时间)
                   ,MAX(NVL(approval_finish_time,SYSDATE)) AS approval_finish_time                  --审批完成时间(节点结束时间)
              FROM ads.a_og_bill_approval_info_detail_day_crm_approval_detail_tmp
             WHERE 1=1
               AND NVL(approval_result,'' '') NOT LIKE ''%自动审批%''
             GROUP BY recpt,department,center,sales_name,bill_number,bill_status,cust_name,proc_submitter,procinstid,proc_start_time,proc_finish_time,actinstid
         )'
    ;

    --获取临时表装载数据执行日志信息
    p_location:='05.2.Insert_a_og_bill_approval_info_detail_day_crm_approval_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：CRM-流程
    p_location:='06.1.create_a_og_bill_approval_info_detail_day_crm_proc_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_crm_proc_tmp ON COMMIT PRESERVE ROWS AS
    SELECT t1.sales_name                                                                            --销售代表
           ,t1.department                                                                           --销售部门
           ,t1.center                                                                               --中心
           ,t1.recpt                                                                                --单据名称
           ,t1.bill_number                                                                          --单据号
           ,t1.bill_status                                                                          --单据状态
           ,t1.cust_name                                                                            --客户名称
           ,t1.proc_submitter                                                                       --流程提交人
           ,t1.procinstid                                                                           --流程实例ID
           ,t1.proc_submitter_time                                                                  --流程提交时间
           ,t1.proc_finish_time                                                                     --流程结束时间
           ,t1.proc_duration_time_cnt                                                               --流程持续时长
           ,t1.approval_time_tot_cnt                                                                --审批持续时长
           ,t2.merged_approvers AS current_processor_name                                           --当年处理人
           ,t2.approval_time_tot_cnt AS current_processor_duration_time_cnt                         --节点审批持续时长
           ,ROW_NUMBER() OVER(PARTITION BY t1.recpt,t1.bill_number ORDER BY t1.proc_submitter_time desc) as proc_rn --流程排序
      FROM (
            SELECT DISTINCT sales_name                                                              --销售代表
                   ,department                                                                      --销售部门
                   ,center                                                                          --中心
                   ,recpt                                                                           --单据名称
                   ,bill_number                                                                     --单据号
                   ,bill_status                                                                     --单据状态
                   ,cust_name                                                                       --客户名称
                   ,proc_submitter                                                                  --流程提交人
                   ,procinstid                                                                      --流程实例ID
                   ,proc_start_time AS proc_submitter_time                                          --流程提交时间
                   ,proc_finish_time                                                                --流程结束时间
                   ,ROUND((NVL(proc_finish_time,SYSDATE)-proc_start_time)*24,2) AS proc_duration_time_cnt 
                   ,ROUND((proc_finish_time-proc_start_time)*24,2) AS approval_time_tot_cnt 
              FROM ads.a_og_bill_approval_info_detail_day_crm_approval_tmp
           ) t1
       LEFT JOIN ads.a_og_bill_approval_info_detail_day_crm_approval_tmp t2
         ON t1.recpt=t2.recpt
        AND t1.bill_number=t2.bill_number
        AND t1.procinstid=t2.procinstid
        AND t1.bill_status<>''已审核''
        AND t2.rn_desc=1'
   ;
    --获取临时表装载数据执行日志信息
    p_location:='06.2.Insert_a_og_bill_approval_info_detail_day_crm_proc_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：拉平审批节点
    p_location:='07.1.create_a_og_bill_approval_info_detail_day_crm_approver_flat_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_crm_approver_flat_tmp ON COMMIT PRESERVE ROWS AS
    SELECT recpt                                                                                    --单据名称
           ,bill_number                                                                             --单据号
           ,procinstid                                                                              --流程实例ID
           ,count(1) AS approval_node_tot_cnt                                                       --审批节点数（个）
           ,MAX(CASE WHEN rn=1 THEN merged_approvers END) AS t1_proc_approval_name                  --第一个流程审批人
           ,MAX(CASE WHEN rn=2 THEN merged_approvers END) AS t2_proc_approval_name                  --第二个流程审批人
           ,MAX(CASE WHEN rn=3 THEN merged_approvers END) AS t3_proc_approval_name                  --第三个流程审批人
           ,MAX(CASE WHEN rn=4 THEN merged_approvers END) AS t4_proc_approval_name                  --第四个流程审批人
           ,MAX(CASE WHEN rn=5 THEN merged_approvers END) AS t5_proc_approval_name                  --第五个流程审批人
           ,MAX(CASE WHEN rn=6 THEN merged_approvers END) AS t6_proc_approval_name                  --第六个流程审批人
           ,MAX(CASE WHEN rn=7 THEN merged_approvers END) AS t7_proc_approval_name                  --第七个流程审批人
           ,MAX(CASE WHEN rn=8 THEN merged_approvers END) AS t8_proc_approval_name                  --第八个流程审批人
           ,MAX(CASE WHEN rn=9 THEN merged_approvers END) AS t9_proc_approval_name                  --第九个流程审批人
           ,MAX(CASE WHEN rn=10 THEN merged_approvers END) AS t10_proc_approval_name                --第十个流程审批人
           ,MAX(CASE WHEN rn=11 THEN merged_approvers END) AS t11_proc_approval_name                --第十一个流程审批人
           ,MAX(CASE WHEN rn=12 THEN merged_approvers END) AS t12_proc_approval_name                --第十二个流程审批人
           ,MAX(CASE WHEN rn=13 THEN merged_approvers END) AS t13_proc_approval_name                --第十三个流程审批人
           ,MAX(CASE WHEN rn=14 THEN merged_approvers END) AS t14_proc_approval_name                --第十四个流程审批人
           ,MAX(CASE WHEN rn=15 THEN merged_approvers END) AS t15_proc_approval_name                --第十五个流程审批人
           ,MAX(CASE WHEN rn=16 THEN merged_approvers END) AS t16_proc_approval_name                --第十六个流程审批人
           ,MAX(CASE WHEN rn=17 THEN merged_approvers END) AS t17_proc_approval_name                --第十七个流程审批人
           ,MAX(CASE WHEN rn=18 THEN merged_approvers END) AS t18_proc_approval_name                --第十八个流程审批人
           ,MAX(CASE WHEN rn=19 THEN merged_approvers END) AS t19_proc_approval_name                --第十九个流程审批人
           ,MAX(CASE WHEN rn=20 THEN merged_approvers END) AS t20_proc_approval_name                --第二十个流程审批人
           ,MAX(CASE WHEN rn=21 THEN merged_approvers END) AS t21_proc_approval_name                --第二十一个流程审批人
           ,MAX(CASE WHEN rn=22 THEN merged_approvers END) AS t22_proc_approval_name                --第二十二个流程审批人
           ,MAX(CASE WHEN rn=23 THEN merged_approvers END) AS t23_proc_approval_name                --第二十三个流程审批人
           ,MAX(CASE WHEN rn=24 THEN merged_approvers END) AS t24_proc_approval_name                --第二十四个流程审批人
           ,MAX(CASE WHEN rn=25 THEN merged_approvers END) AS t25_proc_approval_name                --第二十五个流程审批人
           ,MAX(CASE WHEN rn=26 THEN merged_approvers END) AS t26_proc_approval_name                --第二十六个流程审批人
           ,MAX(CASE WHEN rn=27 THEN merged_approvers END) AS t27_proc_approval_name                --第二十七个流程审批人
           ,MAX(CASE WHEN rn=28 THEN merged_approvers END) AS t28_proc_approval_name                --第二十八个流程审批人
           ,MAX(CASE WHEN rn=29 THEN merged_approvers END) AS t29_proc_approval_name                --第二十九个流程审批人
           ,MAX(CASE WHEN rn=30 THEN merged_approvers END) AS t30_proc_approval_name                --第三十个流程审批人
           ,MAX(CASE WHEN rn=31 THEN merged_approvers END) AS t31_proc_approval_name                --第三十一个流程审批人
           ,MAX(CASE WHEN rn=32 THEN merged_approvers END) AS t32_proc_approval_name                --第三十二个流程审批人
           ,MAX(CASE WHEN rn=33 THEN merged_approvers END) AS t33_proc_approval_name                --第三十三个流程审批人
           ,MAX(CASE WHEN rn=34 THEN merged_approvers END) AS t34_proc_approval_name                --第三十四个流程审批人
           ,MAX(CASE WHEN rn=35 THEN merged_approvers END) AS t35_proc_approval_name                --第三十五个流程审批人
           ,MAX(CASE WHEN rn=1 THEN approval_time_tot_cnt END) AS t1_proc_approval_time_tot_cnt     --第一个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=2 THEN approval_time_tot_cnt END) AS t2_proc_approval_time_tot_cnt     --第二个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=3 THEN approval_time_tot_cnt END) AS t3_proc_approval_time_tot_cnt     --第三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=4 THEN approval_time_tot_cnt END) AS t4_proc_approval_time_tot_cnt     --第四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=5 THEN approval_time_tot_cnt END) AS t5_proc_approval_time_tot_cnt     --第五个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=6 THEN approval_time_tot_cnt END) AS t6_proc_approval_time_tot_cnt     --第六个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=7 THEN approval_time_tot_cnt END) AS t7_proc_approval_time_tot_cnt     --第七个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=8 THEN approval_time_tot_cnt END) AS t8_proc_approval_time_tot_cnt     --第八个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=9 THEN approval_time_tot_cnt END) AS t9_proc_approval_time_tot_cnt     --第九个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=10 THEN approval_time_tot_cnt END) AS t10_proc_approval_time_tot_cnt   --第十个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=11 THEN approval_time_tot_cnt END) AS t11_proc_approval_time_tot_cnt   --第十一个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=12 THEN approval_time_tot_cnt END) AS t12_proc_approval_time_tot_cnt   --第十二个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=13 THEN approval_time_tot_cnt END) AS t13_proc_approval_time_tot_cnt   --第十三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=14 THEN approval_time_tot_cnt END) AS t14_proc_approval_time_tot_cnt   --第十四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=15 THEN approval_time_tot_cnt END) AS t15_proc_approval_time_tot_cnt   --第十五个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=16 THEN approval_time_tot_cnt END) AS t16_proc_approval_time_tot_cnt   --第十六个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=17 THEN approval_time_tot_cnt END) AS t17_proc_approval_time_tot_cnt   --第十七个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=18 THEN approval_time_tot_cnt END) AS t18_proc_approval_time_tot_cnt   --第十八个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=19 THEN approval_time_tot_cnt END) AS t19_proc_approval_time_tot_cnt   --第十九个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=20 THEN approval_time_tot_cnt END) AS t20_proc_approval_time_tot_cnt   --第二十个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=21 THEN approval_time_tot_cnt END) AS t21_proc_approval_time_tot_cnt   --第二十一个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=22 THEN approval_time_tot_cnt END) AS t22_proc_approval_time_tot_cnt   --第二十二个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=23 THEN approval_time_tot_cnt END) AS t23_proc_approval_time_tot_cnt   --第二十三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=24 THEN approval_time_tot_cnt END) AS t24_proc_approval_time_tot_cnt   --第二十四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=25 THEN approval_time_tot_cnt END) AS t25_proc_approval_time_tot_cnt   --第二十五个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=26 THEN approval_time_tot_cnt END) AS t26_proc_approval_time_tot_cnt   --第二十六个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=27 THEN approval_time_tot_cnt END) AS t27_proc_approval_time_tot_cnt   --第二十七个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=28 THEN approval_time_tot_cnt END) AS t28_proc_approval_time_tot_cnt   --第二十八个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=29 THEN approval_time_tot_cnt END) AS t29_proc_approval_time_tot_cnt   --第二十九个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=30 THEN approval_time_tot_cnt END) AS t30_proc_approval_time_tot_cnt   --第三十个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=31 THEN approval_time_tot_cnt END) AS t31_proc_approval_time_tot_cnt   --第三十一个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=32 THEN approval_time_tot_cnt END) AS t32_proc_approval_time_tot_cnt   --第三十二个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=33 THEN approval_time_tot_cnt END) AS t33_proc_approval_time_tot_cnt   --第三十三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=34 THEN approval_time_tot_cnt END) AS t34_proc_approval_time_tot_cnt   --第三十四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=35 THEN approval_time_tot_cnt END) AS t35_proc_approval_time_tot_cnt   --第三十五个流程审批人审批时长（小时）
      FROM ads.a_og_bill_approval_info_detail_day_crm_approval_tmp
     GROUP BY recpt,bill_number,procinstid'
   ;
    --获取临时表装载数据执行日志信息
    p_location:='07.2.Insert_a_og_bill_approval_info_detail_day_crm_approver_flat_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：CRM最终表
    p_location:='08.1.create_a_og_bill_approval_info_detail_day_crm_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_crm_tmp ON COMMIT PRESERVE ROWS AS
    SELECT NVL(t1.center,N''中心为空'') AS center                                                   --中心
           ,NVL(t1.department,N''部门为空'') AS department                                          --部门
           ,NVL(t1.sales_name,N''销售代表姓名为空'') AS sales_name                                  --销售代表
           ,t1.recpt AS bill_name                                                                   --单据名称
           ,t1.bill_number                                                                          --单据号
           ,t1.bill_status                                                                          --单据状态
           ,t1.cust_name                                                                            --客户名称
           ,t1.proc_submitter                                                                       --流程提交人
           ,t1.proc_submitter_time                                                                  --流程提交时间
           ,t1.proc_duration_time_cnt                                                               --流程持续时长
           ,t1.approval_time_tot_cnt                                                                --审批持续时长
           ,t1.current_processor_name                                                               --当前审批人
           ,t1.current_processor_duration_time_cnt                                                  --当前节点审批持续时长
           ,t2.approval_node_tot_cnt                                                                --审批节点数（个）
           ,t2.t1_proc_approval_name                                                                --第一个流程审批人
           ,t2.t2_proc_approval_name                                                                --第二个流程审批人
           ,t2.t3_proc_approval_name                                                                --第三个流程审批人
           ,t2.t4_proc_approval_name                                                                --第四个流程审批人
           ,t2.t5_proc_approval_name                                                                --第五个流程审批人
           ,t2.t6_proc_approval_name                                                                --第六个流程审批人
           ,t2.t7_proc_approval_name                                                                --第七个流程审批人
           ,t2.t8_proc_approval_name                                                                --第八个流程审批人
           ,t2.t9_proc_approval_name                                                                --第九个流程审批人
           ,t2.t10_proc_approval_name                                                               --第十个流程审批人
           ,t2.t11_proc_approval_name                                                               --第十一个流程审批人
           ,t2.t12_proc_approval_name                                                               --第十二个流程审批人
           ,t2.t13_proc_approval_name                                                               --第十三个流程审批人
           ,t2.t14_proc_approval_name                                                               --第十四个流程审批人
           ,t2.t15_proc_approval_name                                                               --第十五个流程审批人
           ,t2.t16_proc_approval_name                                                               --第十六个流程审批人
           ,t2.t17_proc_approval_name                                                               --第十七个流程审批人
           ,t2.t18_proc_approval_name                                                               --第十八个流程审批人
           ,t2.t19_proc_approval_name                                                               --第十九个流程审批人
           ,t2.t20_proc_approval_name                                                               --第二十个流程审批人
           ,t2.t21_proc_approval_name                                                               --第二十一个流程审批人
           ,t2.t22_proc_approval_name                                                               --第二十二个流程审批人
           ,t2.t23_proc_approval_name                                                               --第二十三个流程审批人
           ,t2.t24_proc_approval_name                                                               --第二十四个流程审批人
           ,t2.t25_proc_approval_name                                                               --第二十五个流程审批人
           ,t2.t26_proc_approval_name                                                               --第二十六个流程审批人
           ,t2.t27_proc_approval_name                                                               --第二十七个流程审批人
           ,t2.t28_proc_approval_name                                                               --第二十八个流程审批人
           ,t2.t29_proc_approval_name                                                               --第二十九个流程审批人
           ,t2.t30_proc_approval_name                                                               --第三十个流程审批人
           ,t2.t31_proc_approval_name                                                               --第三十一个流程审批人
           ,t2.t32_proc_approval_name                                                               --第三十二个流程审批人
           ,t2.t33_proc_approval_name                                                               --第三十三个流程审批人
           ,t2.t34_proc_approval_name                                                               --第三十四个流程审批人
           ,t2.t35_proc_approval_name                                                               --第三十五个流程审批人
           ,t2.t1_proc_approval_time_tot_cnt                                                        --第一个流程审批人审批时长（小时）
           ,t2.t2_proc_approval_time_tot_cnt                                                        --第二个流程审批人审批时长（小时）
           ,t2.t3_proc_approval_time_tot_cnt                                                        --第三个流程审批人审批时长（小时）
           ,t2.t4_proc_approval_time_tot_cnt                                                        --第四个流程审批人审批时长（小时）
           ,t2.t5_proc_approval_time_tot_cnt                                                        --第五个流程审批人审批时长（小时）
           ,t2.t6_proc_approval_time_tot_cnt                                                        --第六个流程审批人审批时长（小时）
           ,t2.t7_proc_approval_time_tot_cnt                                                        --第七个流程审批人审批时长（小时）
           ,t2.t8_proc_approval_time_tot_cnt                                                        --第八个流程审批人审批时长（小时）
           ,t2.t9_proc_approval_time_tot_cnt                                                        --第九个流程审批人审批时长（小时）    
           ,t2.t10_proc_approval_time_tot_cnt                                                       --第十个流程审批人审批时长（小时）    
           ,t2.t11_proc_approval_time_tot_cnt                                                       --第十一个流程审批人审批时长（小时）    
           ,t2.t12_proc_approval_time_tot_cnt                                                       --第十二个流程审批人审批时长（小时）    
           ,t2.t13_proc_approval_time_tot_cnt                                                       --第十三个流程审批人审批时长（小时）
           ,t2.t14_proc_approval_time_tot_cnt                                                       --第十四个流程审批人审批时长（小时）
           ,t2.t15_proc_approval_time_tot_cnt                                                       --第十五个流程审批人审批时长（小时）
           ,t2.t16_proc_approval_time_tot_cnt                                                       --第十六个流程审批人审批时长（小时）
           ,t2.t17_proc_approval_time_tot_cnt                                                       --第十七个流程审批人审批时长（小时）
           ,t2.t18_proc_approval_time_tot_cnt                                                       --第十八个流程审批人审批时长（小时）
           ,t2.t19_proc_approval_time_tot_cnt                                                       --第十九个流程审批人审批时长（小时）
           ,t2.t20_proc_approval_time_tot_cnt                                                       --第二十个流程审批人审批时长（小时）
           ,t2.t21_proc_approval_time_tot_cnt                                                       --第二十一个流程审批人审批时长（小时）
           ,t2.t22_proc_approval_time_tot_cnt                                                       --第二十二个流程审批人审批时长（小时）
           ,t2.t23_proc_approval_time_tot_cnt                                                       --第二十三个流程审批人审批时长（小时）
           ,t2.t24_proc_approval_time_tot_cnt                                                       --第二十四个流程审批人审批时长（小时）
           ,t2.t25_proc_approval_time_tot_cnt                                                       --第二十五个流程审批人审批时长（小时）
           ,t2.t26_proc_approval_time_tot_cnt                                                       --第二十六个流程审批人审批时长（小时）
           ,t2.t27_proc_approval_time_tot_cnt                                                       --第二十七个流程审批人审批时长（小时）
           ,t2.t28_proc_approval_time_tot_cnt                                                       --第二十八个流程审批人审批时长（小时）
           ,t2.t29_proc_approval_time_tot_cnt                                                       --第二十九个流程审批人审批时长（小时）
           ,t2.t30_proc_approval_time_tot_cnt                                                       --第三十个流程审批人审批时长（小时）
           ,t2.t31_proc_approval_time_tot_cnt                                                       --第三十一个流程审批人审批时长（小时）
           ,t2.t32_proc_approval_time_tot_cnt                                                       --第三十二个流程审批人审批时长（小时）
           ,t2.t33_proc_approval_time_tot_cnt                                                       --第三十三个流程审批人审批时长（小时）
           ,t2.t34_proc_approval_time_tot_cnt                                                       --第三十四个流程审批人审批时长（小时）
           ,t2.t35_proc_approval_time_tot_cnt                                                       --第三十五个流程审批人审批时长（小时）
      FROM ads.a_og_bill_approval_info_detail_day_crm_proc_tmp t1
      LEFT JOIN ads.a_og_bill_approval_info_detail_day_crm_approver_flat_tmp t2
        ON t1.recpt=t2.recpt
       AND t1.bill_number=t2.bill_number
       AND t1.procinstid=t2.procinstid
     WHERE t1.proc_rn=1'
   ;

    --获取临时表装载数据执行日志信息
    p_location:='08.2.Insert_a_og_bill_approval_info_detail_day_crm_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：EAS-单据数据
    p_location:='09.1.create_a_og_bill_approval_info_detail_day_eas_bill_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_eas_bill_tmp ON COMMIT PRESERVE ROWS AS
    SELECT t1.fid                                                                                   --ID
           ,t1.fnumber AS bill_number                                                               --单据号
           ,''EAS销售订单'' AS recpt                                                                --单据名称
           ,t1.fsalepersonid AS sales_staff_id                                                      --销售代表ID
           ,t1.cfcustomernumber AS cust_number                                                      --客户编码
           ,CASE WHEN t1.fbasestatus=-3 THEN ''历史版本'' WHEN t1.fbasestatus=-2 THEN ''变更中'' WHEN t1.fbasestatus=-1 THEN '''' WHEN t1.fbasestatus=0 THEN ''新增'' WHEN t1.fbasestatus=1 THEN ''已保存'' 
                   WHEN t1.fbasestatus=2 THEN ''已提交'' WHEN t1.fbasestatus=3 THEN ''已作废'' WHEN t1.fbasestatus=4 THEN ''已审核'' WHEN t1.fbasestatus=5 THEN ''已下达'' WHEN t1.fbasestatus=6 THEN ''已冻结'' 
                   WHEN t1.fbasestatus=7 THEN ''已关闭'' WHEN t1.fbasestatus=8 THEN ''已完工'' WHEN t1.fbasestatus=90 THEN ''已完成'' WHEN t1.fbasestatus=10 THEN ''已发布'' WHEN t1.fbasestatus=11 THEN ''已结案'' 
                   WHEN t1.fbasestatus=12 THEN ''已锁定'' WHEN t1.fbasestatus=13 THEN ''已取消''
            END AS bill_status                                                                      --单据状态
      FROM ods.o_eas_t_sd_saleorder t1
     WHERE 1=1
       AND t1.data_date='''||p_data_date||'''
       AND t1.fbasestatus IN(-2,-1,0,2,4,5,8,90,10,11,12)
       AND t1.fsaleorgunitid=''/v0AAAAABLLM567U''
     UNION ALL
    SELECT t1.fid                                                                                   --ID
           ,t1.fnumber AS bill_number                                                               --单据号
           ,''EAS发货通知单'' AS recpt                                                              --单据名称
           ,t1.cfsalepersonid AS sales_staff_id                                                     --销售代表ID
           ,t1.cfcustomernumber AS cust_number                                                      --客户编码
           ,CASE WHEN t1.fbasestatus=-3 THEN ''历史版本'' WHEN t1.fbasestatus=-2 THEN ''变更中'' WHEN t1.fbasestatus=-1 THEN '''' WHEN t1.fbasestatus=0 THEN ''新增'' WHEN t1.fbasestatus=1 THEN ''已保存'' 
                   WHEN t1.fbasestatus=2 THEN ''已提交'' WHEN t1.fbasestatus=3 THEN ''已作废'' WHEN t1.fbasestatus=4 THEN ''已审核'' WHEN t1.fbasestatus=5 THEN ''已下达'' WHEN t1.fbasestatus=6 THEN ''已冻结'' 
                   WHEN t1.fbasestatus=7 THEN ''已关闭'' WHEN t1.fbasestatus=8 THEN ''已完工'' WHEN t1.fbasestatus=90 THEN ''已完成'' WHEN t1.fbasestatus=10 THEN ''已发布'' WHEN t1.fbasestatus=11 THEN ''已结案'' 
                   WHEN t1.fbasestatus=12 THEN ''已锁定'' WHEN t1.fbasestatus=13 THEN ''已取消''
             END AS bill_status                                                                     --单据状态
      FROM ods.o_eas_t_sd_postrequisition t1
     WHERE 1=1
       AND t1.data_date='''||p_data_date||'''
       AND t1.fbasestatus IN(-2,-1,0,2,4,5,8,90,10,11,12)
       AND t1.fsaleorgunitid=''/v0AAAAABLLM567U'''
   ;

    --获取临时表装载数据执行日志信息
    p_location:='09.2.Insert_a_og_bill_approval_info_detail_day_eas_bill_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：EAS-销售代表信息表
    p_location:='10.1.create_a_og_bill_approval_info_detail_day_eas_sales_staff_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_eas_sales_staff_tmp ON COMMIT PRESERVE ROWS AS
    SELECT fd_55wzzvvk5i0 AS center                                                                 --中心
           ,fd_4ph18h5opeq AS department                                                            --部门
           ,fd_7z4yeotsba0 AS staff_number                                                          --员工编号
           FROM(SELECT fd_55wzzvvk5i0
                       ,fd_7z4yeotsba0
                       ,fd_4ph18h5opeq
                       ,ROW_NUMBER() OVER (PARTITION BY fd_7z4yeotsba0 ORDER BY fd_b9zewex6d7s DESC) AS rn 
                  FROM ods.o_dsr_auto_1h4d2m8f6 
                 WHERE data_date='''||p_data_date||'''
                   AND TO_DATE(TO_CHAR(fd_b9zewex6d7s,''YYYY-MM-DD''),''YYYY-MM-DD'')>=TO_DATE('''||p_data_date||''',''YYYY-MM-DD'') 
                   AND TO_DATE(TO_CHAR(fd_nzuadieqkpc,''YYYY-MM-DD''),''YYYY-MM-DD'')<=TO_DATE('''||p_data_date||''',''YYYY-MM-DD'')
                )t 
     WHERE rn=1'
   ;

    --获取临时表装载数据执行日志信息
    p_location:='10.2.Insert_a_og_bill_approval_info_detail_day_eas_sales_staff_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：EAS-审批明细
    p_location:='11.1.create_a_og_bill_approval_info_detail_day_eas_approval_detail_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_eas_approval_detail_tmp ON COMMIT PRESERVE ROWS AS
    SELECT t4.fname_l2 AS sales_name                                                                --销售代表
           ,t6.department                                                                           --销售部门
           ,t6.center                                                                               --中心
           ,t1.recpt                                                                                --单据名称
           ,t1.bill_number                                                                          --单据号
           ,t1.bill_status                                                                          --单据状态
           ,t5.fname_l2 AS cust_name                                                                --客户名称
           ,t3.finitiatorname_l2 AS proc_submitter                                                  --流程提交人
           ,t2.fprocinstid AS procinstid                                                            --流程实例ID
           ,TO_DATE(TO_CHAR(t3.fcreatedtime,''yyyy-mm-dd hh24-mi-ss''),''yyyy-mm-dd hh24-mi-ss'') AS proc_start_time --流程创建时间
           ,TO_DATE(TO_CHAR(t3.fcomletetime,''yyyy-mm-dd hh24-mi-ss''),''yyyy-mm-dd hh24-mi-ss'') AS proc_finish_time --流程结束时间
           ,t3.fstate AS proc_status                                                                --流程状态
           ,t2.factinstid AS actinstid                                                              --流程节点ID(活动实例ID)
           ,t2.fpersonusername_l2 AS approver                                                       --流程节点审批人
           ,TO_DATE(TO_CHAR(t2.fcreatedtime,''yyyy-mm-dd hh24-mi-ss''),''yyyy-mm-dd hh24-mi-ss'') AS approval_start_time --审批开始时间(节点创建时间)
           ,TO_DATE(TO_CHAR(t2.fendtime,''yyyy-mm-dd hh24-mi-ss''),''yyyy-mm-dd hh24-mi-ss'') AS approval_finish_time --审批完成时间(节点结束时间)
           ,t2.fstate AS approval_status                                                            --审批状态
      FROM ads.a_og_bill_approval_info_detail_day_eas_bill_tmp t1
      LEFT JOIN ods.o_eas_t_wfr_assignview t2
        ON t1.fid=t2.fbizobjid
       AND t2.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_eas_t_wfr_procinstview t3
        ON t2.fprocinstid = t3.fprocinstid 
       AND t3.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_eas_t_bd_person t4
        ON t1.sales_staff_id=t4.fid
       AND t4.data_date='''||p_data_date||'''
      LEFT JOIN ods.o_eas_t_bd_customer t5
        ON t1.cust_number=t5.fnumber
       AND t5.data_date='''||p_data_date||'''
      LEFT JOIN ads.a_og_bill_approval_info_detail_day_eas_sales_staff_tmp t6
        ON t4.fnumber=t6.staff_number
     WHERE 1=1
       AND t3.fstate IN(''open.running'',''closed.completed'')
       AND (t3.fprocdefname_l2 LIKE ''%发货通知单%'' OR t3.fprocdefname_l2 LIKE ''%销售订单%'')
       AND t1.fid IS NOT NULL'
   ;

    --获取临时表装载数据执行日志信息
    p_location:='11.2.Insert_a_og_bill_approval_info_detail_day_eas_approval_detail_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：EAS-汇总审批节点
    p_location:='12.1.create_a_og_bill_approval_info_detail_day_eas_approval_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_eas_approval_tmp ON COMMIT PRESERVE ROWS AS
    SELECT recpt                                                                                    --单据名称
           ,department                                                                              --销售部门
           ,center                                                                                  --中心
           ,sales_name                                                                              --销售代表
           ,bill_number                                                                             --单据号
           ,bill_status                                                                             --单据状态
           ,cust_name                                                                               --客户名称
           ,proc_submitter                                                                          --流程提交人
           ,procinstid                                                                              --流程实例ID
           ,proc_start_time                                                                         --流程创建时间
           ,proc_finish_time                                                                        --流程结束时间
           ,proc_status                                                                             --流程状态
           ,actinstid                                                                               --流程节点ID(活动实例ID)
           ,merged_approvers                                                                        --节点审批人
           ,approval_start_time                                                                     --审批开始时间(节点创建时间)
           ,approval_finish_time                                                                    --审批完成时间(节点结束时间)
           ,ROUND((NVL(approval_finish_time,SYSDATE)-approval_start_time)*24,2) AS approval_time_tot_cnt --节点审批时长
           ,approval_status                                                                         --审批状态
           ,ROW_NUMBER() OVER(PARTITION BY recpt,bill_number,procinstid ORDER BY approval_finish_time) AS rn --正向排序
           ,ROW_NUMBER() OVER(PARTITION BY recpt,bill_number,procinstid ORDER BY approval_finish_time DESC) AS rn_desc --反向排序
    FROM ( SELECT recpt                                                                             --单据名称
                   ,department                                                                      --销售部门
                   ,center                                                                          --中心
                   ,sales_name                                                                      --销售代表
                   ,bill_number                                                                     --单据号
                   ,bill_status                                                                     --单据状态
                   ,cust_name                                                                       --客户名称
                   ,proc_submitter                                                                  --流程提交人
                   ,procinstid                                                                      --流程实例ID
                   ,proc_start_time                                                                 --流程创建时间
                   ,proc_finish_time                                                                --流程结束时间
                   ,proc_status                                                                     --流程状态
                   ,actinstid                                                                       --流程节点ID(活动实例ID)
                   ,LISTAGG(approver,'','') WITHIN GROUP (ORDER BY approval_start_time) AS merged_approvers --节点审批人
                   ,MIN(approval_start_time) AS approval_start_time                                 --审批开始时间(节点创建时间)
                   ,MAX(NVL(approval_finish_time,SYSDATE)) AS approval_finish_time                               --审批完成时间(节点结束时间)
                   ,MAX(approval_status) AS approval_status                                         --审批状态
              FROM ads.a_og_bill_approval_info_detail_day_eas_approval_detail_tmp
             GROUP BY recpt,department,center,sales_name,bill_number,bill_status,cust_name,proc_submitter,procinstid,proc_start_time,proc_finish_time,proc_status,actinstid
         )'
   ;
    --获取临时表装载数据执行日志信息
    p_location:='12.2.Insert_a_og_bill_approval_info_detail_day_eas_approval_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：流程
    p_location:='13.1.create_a_og_bill_approval_info_detail_day_eas_proc_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_eas_proc_tmp ON COMMIT PRESERVE ROWS AS
    SELECT t1.sales_name                                                                            --销售代表
           ,t1.department                                                                           --销售部门
           ,t1.center                                                                               --中心
           ,t1.recpt                                                                                --单据名称
           ,t1.bill_number                                                                          --单据号
           ,t1.bill_status                                                                          --单据状态
           ,t1.cust_name                                                                            --客户名称
           ,t1.proc_submitter                                                                       --流程提交人
           ,t1.procinstid                                                                           --流程实例ID
           ,t1.proc_submitter_time                                                                  --流程提交时间
           ,t1.proc_finish_time                                                                     --流程结束时间
           ,t1.proc_duration_time_cnt                                                               --流程持续时长
           ,t1.approval_time_tot_cnt                                                                --审批持续时长
           ,t2.merged_approvers AS current_processor_name                                           --当年处理人
           ,t2.approval_time_tot_cnt AS current_processor_duration_time_cnt                         --节点审批持续时长
           ,ROW_NUMBER() OVER(PARTITION BY t1.recpt,t1.bill_number ORDER BY t1.proc_submitter_time desc) as proc_rn --流程排序
      FROM (
            SELECT DISTINCT sales_name                                                              --销售代表
                   ,department                                                                      --销售部门
                   ,center                                                                          --中心
                   ,recpt                                                                           --单据名称
                   ,bill_number                                                                     --单据号
                   ,bill_status                                                                     --单据状态
                   ,cust_name                                                                       --客户名称
                   ,proc_submitter                                                                  --流程提交人
                   ,procinstid                                                                      --流程实例ID
                   ,proc_start_time AS proc_submitter_time                                          --流程提交时间
                   ,proc_finish_time                                                                --流程结束时间
                   ,ROUND((NVL(proc_finish_time,SYSDATE)-proc_start_time)*24,2) AS proc_duration_time_cnt 
                   ,ROUND((proc_finish_time-proc_start_time)*24,2) AS approval_time_tot_cnt 
              FROM ads.a_og_bill_approval_info_detail_day_eas_approval_tmp
           ) t1
       LEFT JOIN ads.a_og_bill_approval_info_detail_day_eas_approval_tmp t2
         ON t1.recpt=t2.recpt
        AND t1.bill_number=t2.bill_number
        AND t1.procinstid=t2.procinstid
        AND t1.bill_status<>''已审核''
        AND t2.rn_desc=1'
   ;
    --获取临时表装载数据执行日志信息
    p_location:='13.2.Insert_a_og_bill_approval_info_detail_day_eas_proc_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：拉平审批节点
    p_location:='14.1.create_a_og_bill_approval_info_detail_day_eas_approver_flat_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_eas_approver_flat_tmp ON COMMIT PRESERVE ROWS AS
    SELECT recpt                                                                                    --单据名称
           ,bill_number                                                                             --单据号
           ,procinstid                                                                              --流程实例ID
           ,count(1) AS approval_node_tot_cnt                                                       --审批节点数（个）
           ,MAX(CASE WHEN rn=1 THEN merged_approvers END) AS t1_proc_approval_name                  --第一个流程审批人
           ,MAX(CASE WHEN rn=2 THEN merged_approvers END) AS t2_proc_approval_name                  --第二个流程审批人
           ,MAX(CASE WHEN rn=3 THEN merged_approvers END) AS t3_proc_approval_name                  --第三个流程审批人
           ,MAX(CASE WHEN rn=4 THEN merged_approvers END) AS t4_proc_approval_name                  --第四个流程审批人
           ,MAX(CASE WHEN rn=5 THEN merged_approvers END) AS t5_proc_approval_name                  --第五个流程审批人
           ,MAX(CASE WHEN rn=6 THEN merged_approvers END) AS t6_proc_approval_name                  --第六个流程审批人
           ,MAX(CASE WHEN rn=7 THEN merged_approvers END) AS t7_proc_approval_name                  --第七个流程审批人
           ,MAX(CASE WHEN rn=8 THEN merged_approvers END) AS t8_proc_approval_name                  --第八个流程审批人
           ,MAX(CASE WHEN rn=9 THEN merged_approvers END) AS t9_proc_approval_name                  --第九个流程审批人
           ,MAX(CASE WHEN rn=10 THEN merged_approvers END) AS t10_proc_approval_name                --第十个流程审批人
           ,MAX(CASE WHEN rn=11 THEN merged_approvers END) AS t11_proc_approval_name                --第十一个流程审批人
           ,MAX(CASE WHEN rn=12 THEN merged_approvers END) AS t12_proc_approval_name                --第十二个流程审批人
           ,MAX(CASE WHEN rn=13 THEN merged_approvers END) AS t13_proc_approval_name                --第十三个流程审批人
           ,MAX(CASE WHEN rn=14 THEN merged_approvers END) AS t14_proc_approval_name                --第十四个流程审批人
           ,MAX(CASE WHEN rn=15 THEN merged_approvers END) AS t15_proc_approval_name                --第十五个流程审批人
           ,MAX(CASE WHEN rn=16 THEN merged_approvers END) AS t16_proc_approval_name                --第十六个流程审批人
           ,MAX(CASE WHEN rn=17 THEN merged_approvers END) AS t17_proc_approval_name                --第十七个流程审批人
           ,MAX(CASE WHEN rn=18 THEN merged_approvers END) AS t18_proc_approval_name                --第十八个流程审批人
           ,MAX(CASE WHEN rn=19 THEN merged_approvers END) AS t19_proc_approval_name                --第十九个流程审批人
           ,MAX(CASE WHEN rn=20 THEN merged_approvers END) AS t20_proc_approval_name                --第二十个流程审批人
           ,MAX(CASE WHEN rn=21 THEN merged_approvers END) AS t21_proc_approval_name                --第二十一个流程审批人
           ,MAX(CASE WHEN rn=22 THEN merged_approvers END) AS t22_proc_approval_name                --第二十二个流程审批人
           ,MAX(CASE WHEN rn=23 THEN merged_approvers END) AS t23_proc_approval_name                --第二十三个流程审批人
           ,MAX(CASE WHEN rn=24 THEN merged_approvers END) AS t24_proc_approval_name                --第二十四个流程审批人
           ,MAX(CASE WHEN rn=25 THEN merged_approvers END) AS t25_proc_approval_name                --第二十五个流程审批人
           ,MAX(CASE WHEN rn=26 THEN merged_approvers END) AS t26_proc_approval_name                --第二十六个流程审批人
           ,MAX(CASE WHEN rn=27 THEN merged_approvers END) AS t27_proc_approval_name                --第二十七个流程审批人
           ,MAX(CASE WHEN rn=28 THEN merged_approvers END) AS t28_proc_approval_name                --第二十八个流程审批人
           ,MAX(CASE WHEN rn=29 THEN merged_approvers END) AS t29_proc_approval_name                --第二十九个流程审批人
           ,MAX(CASE WHEN rn=30 THEN merged_approvers END) AS t30_proc_approval_name                --第三十个流程审批人
           ,MAX(CASE WHEN rn=31 THEN merged_approvers END) AS t31_proc_approval_name                --第三十一个流程审批人
           ,MAX(CASE WHEN rn=32 THEN merged_approvers END) AS t32_proc_approval_name                --第三十二个流程审批人
           ,MAX(CASE WHEN rn=33 THEN merged_approvers END) AS t33_proc_approval_name                --第三十三个流程审批人
           ,MAX(CASE WHEN rn=34 THEN merged_approvers END) AS t34_proc_approval_name                --第三十四个流程审批人
           ,MAX(CASE WHEN rn=35 THEN merged_approvers END) AS t35_proc_approval_name                --第三十五个流程审批人
           ,MAX(CASE WHEN rn=1 THEN approval_time_tot_cnt END) AS t1_proc_approval_time_tot_cnt     --第一个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=2 THEN approval_time_tot_cnt END) AS t2_proc_approval_time_tot_cnt     --第二个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=3 THEN approval_time_tot_cnt END) AS t3_proc_approval_time_tot_cnt     --第三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=4 THEN approval_time_tot_cnt END) AS t4_proc_approval_time_tot_cnt     --第四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=5 THEN approval_time_tot_cnt END) AS t5_proc_approval_time_tot_cnt     --第五个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=6 THEN approval_time_tot_cnt END) AS t6_proc_approval_time_tot_cnt     --第六个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=7 THEN approval_time_tot_cnt END) AS t7_proc_approval_time_tot_cnt     --第七个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=8 THEN approval_time_tot_cnt END) AS t8_proc_approval_time_tot_cnt     --第八个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=9 THEN approval_time_tot_cnt END) AS t9_proc_approval_time_tot_cnt     --第九个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=10 THEN approval_time_tot_cnt END) AS t10_proc_approval_time_tot_cnt   --第十个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=11 THEN approval_time_tot_cnt END) AS t11_proc_approval_time_tot_cnt   --第十一个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=12 THEN approval_time_tot_cnt END) AS t12_proc_approval_time_tot_cnt   --第十二个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=13 THEN approval_time_tot_cnt END) AS t13_proc_approval_time_tot_cnt   --第十三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=14 THEN approval_time_tot_cnt END) AS t14_proc_approval_time_tot_cnt   --第十四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=15 THEN approval_time_tot_cnt END) AS t15_proc_approval_time_tot_cnt   --第十五个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=16 THEN approval_time_tot_cnt END) AS t16_proc_approval_time_tot_cnt   --第十六个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=17 THEN approval_time_tot_cnt END) AS t17_proc_approval_time_tot_cnt   --第十七个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=18 THEN approval_time_tot_cnt END) AS t18_proc_approval_time_tot_cnt   --第十八个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=19 THEN approval_time_tot_cnt END) AS t19_proc_approval_time_tot_cnt   --第十九个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=20 THEN approval_time_tot_cnt END) AS t20_proc_approval_time_tot_cnt   --第二十个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=21 THEN approval_time_tot_cnt END) AS t21_proc_approval_time_tot_cnt   --第二十一个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=22 THEN approval_time_tot_cnt END) AS t22_proc_approval_time_tot_cnt   --第二十二个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=23 THEN approval_time_tot_cnt END) AS t23_proc_approval_time_tot_cnt   --第二十三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=24 THEN approval_time_tot_cnt END) AS t24_proc_approval_time_tot_cnt   --第二十四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=25 THEN approval_time_tot_cnt END) AS t25_proc_approval_time_tot_cnt   --第二十五个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=26 THEN approval_time_tot_cnt END) AS t26_proc_approval_time_tot_cnt   --第二十六个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=27 THEN approval_time_tot_cnt END) AS t27_proc_approval_time_tot_cnt   --第二十七个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=28 THEN approval_time_tot_cnt END) AS t28_proc_approval_time_tot_cnt   --第二十八个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=29 THEN approval_time_tot_cnt END) AS t29_proc_approval_time_tot_cnt   --第二十九个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=30 THEN approval_time_tot_cnt END) AS t30_proc_approval_time_tot_cnt   --第三十个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=31 THEN approval_time_tot_cnt END) AS t31_proc_approval_time_tot_cnt   --第三十一个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=32 THEN approval_time_tot_cnt END) AS t32_proc_approval_time_tot_cnt   --第三十二个流程审批人审批时长（小时）    
           ,MAX(CASE WHEN rn=33 THEN approval_time_tot_cnt END) AS t33_proc_approval_time_tot_cnt   --第三十三个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=34 THEN approval_time_tot_cnt END) AS t34_proc_approval_time_tot_cnt   --第三十四个流程审批人审批时长（小时）
           ,MAX(CASE WHEN rn=35 THEN approval_time_tot_cnt END) AS t35_proc_approval_time_tot_cnt   --第三十五个流程审批人审批时长（小时）
      FROM ads.a_og_bill_approval_info_detail_day_eas_approval_tmp
     GROUP BY recpt,bill_number,procinstid'
   ;
    --获取临时表装载数据执行日志信息
    p_location:='14.2.Insert_a_og_bill_approval_info_detail_day_eas_approver_flat_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --创建临时表：EAS最终表
    p_location:='15.1.create_a_og_bill_approval_info_detail_day_eas_tmp_table';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'CREATE GLOBAL TEMPORARY TABLE ads.a_og_bill_approval_info_detail_day_eas_tmp ON COMMIT PRESERVE ROWS AS
    SELECT NVL(t1.center,N''中心为空'') AS center                                                   --中心
           ,NVL(t1.department,N''部门为空'') AS department                                          --部门
           ,NVL(t1.sales_name,N''销售代表姓名为空'') AS sales_name                                  --销售代表
           ,t1.recpt AS bill_name                                                                   --单据名称
           ,t1.bill_number                                                                          --单据号
           ,t1.bill_status                                                                          --单据状态
           ,t1.cust_name                                                                            --客户名称
           ,t1.proc_submitter                                                                       --流程提交人
           ,t1.proc_submitter_time                                                                  --流程提交时间
           ,t1.proc_duration_time_cnt                                                               --流程持续时长
           ,t1.approval_time_tot_cnt                                                                --审批持续时长
           ,t1.current_processor_name                                                               --当前审批人
           ,t1.current_processor_duration_time_cnt                                                  --当前节点审批持续时长
           ,t2.approval_node_tot_cnt                                                                --审批节点数（个）
           ,t2.t1_proc_approval_name                                                                --第一个流程审批人
           ,t2.t2_proc_approval_name                                                                --第二个流程审批人
           ,t2.t3_proc_approval_name                                                                --第三个流程审批人
           ,t2.t4_proc_approval_name                                                                --第四个流程审批人
           ,t2.t5_proc_approval_name                                                                --第五个流程审批人
           ,t2.t6_proc_approval_name                                                                --第六个流程审批人
           ,t2.t7_proc_approval_name                                                                --第七个流程审批人
           ,t2.t8_proc_approval_name                                                                --第八个流程审批人
           ,t2.t9_proc_approval_name                                                                --第九个流程审批人
           ,t2.t10_proc_approval_name                                                               --第十个流程审批人
           ,t2.t11_proc_approval_name                                                               --第十一个流程审批人
           ,t2.t12_proc_approval_name                                                               --第十二个流程审批人
           ,t2.t13_proc_approval_name                                                               --第十三个流程审批人
           ,t2.t14_proc_approval_name                                                               --第十四个流程审批人
           ,t2.t15_proc_approval_name                                                               --第十五个流程审批人
           ,t2.t16_proc_approval_name                                                               --第十六个流程审批人
           ,t2.t17_proc_approval_name                                                               --第十七个流程审批人
           ,t2.t18_proc_approval_name                                                               --第十八个流程审批人
           ,t2.t19_proc_approval_name                                                               --第十九个流程审批人
           ,t2.t20_proc_approval_name                                                               --第二十个流程审批人
           ,t2.t21_proc_approval_name                                                               --第二十一个流程审批人
           ,t2.t22_proc_approval_name                                                               --第二十二个流程审批人
           ,t2.t23_proc_approval_name                                                               --第二十三个流程审批人
           ,t2.t24_proc_approval_name                                                               --第二十四个流程审批人
           ,t2.t25_proc_approval_name                                                               --第二十五个流程审批人
           ,t2.t26_proc_approval_name                                                               --第二十六个流程审批人
           ,t2.t27_proc_approval_name                                                               --第二十七个流程审批人
           ,t2.t28_proc_approval_name                                                               --第二十八个流程审批人
           ,t2.t29_proc_approval_name                                                               --第二十九个流程审批人
           ,t2.t30_proc_approval_name                                                               --第三十个流程审批人
           ,t2.t31_proc_approval_name                                                               --第三十一个流程审批人
           ,t2.t32_proc_approval_name                                                               --第三十二个流程审批人
           ,t2.t33_proc_approval_name                                                               --第三十三个流程审批人
           ,t2.t34_proc_approval_name                                                               --第三十四个流程审批人
           ,t2.t35_proc_approval_name                                                               --第三十五个流程审批人
           ,t2.t1_proc_approval_time_tot_cnt                                                        --第一个流程审批人审批时长（小时）
           ,t2.t2_proc_approval_time_tot_cnt                                                        --第二个流程审批人审批时长（小时）
           ,t2.t3_proc_approval_time_tot_cnt                                                        --第三个流程审批人审批时长（小时）
           ,t2.t4_proc_approval_time_tot_cnt                                                        --第四个流程审批人审批时长（小时）
           ,t2.t5_proc_approval_time_tot_cnt                                                        --第五个流程审批人审批时长（小时）
           ,t2.t6_proc_approval_time_tot_cnt                                                        --第六个流程审批人审批时长（小时）
           ,t2.t7_proc_approval_time_tot_cnt                                                        --第七个流程审批人审批时长（小时）
           ,t2.t8_proc_approval_time_tot_cnt                                                        --第八个流程审批人审批时长（小时）
           ,t2.t9_proc_approval_time_tot_cnt                                                        --第九个流程审批人审批时长（小时）    
           ,t2.t10_proc_approval_time_tot_cnt                                                       --第十个流程审批人审批时长（小时）    
           ,t2.t11_proc_approval_time_tot_cnt                                                       --第十一个流程审批人审批时长（小时）    
           ,t2.t12_proc_approval_time_tot_cnt                                                       --第十二个流程审批人审批时长（小时）    
           ,t2.t13_proc_approval_time_tot_cnt                                                       --第十三个流程审批人审批时长（小时）
           ,t2.t14_proc_approval_time_tot_cnt                                                       --第十四个流程审批人审批时长（小时）
           ,t2.t15_proc_approval_time_tot_cnt                                                       --第十五个流程审批人审批时长（小时）
           ,t2.t16_proc_approval_time_tot_cnt                                                       --第十六个流程审批人审批时长（小时）
           ,t2.t17_proc_approval_time_tot_cnt                                                       --第十七个流程审批人审批时长（小时）
           ,t2.t18_proc_approval_time_tot_cnt                                                       --第十八个流程审批人审批时长（小时）
           ,t2.t19_proc_approval_time_tot_cnt                                                       --第十九个流程审批人审批时长（小时）
           ,t2.t20_proc_approval_time_tot_cnt                                                       --第二十个流程审批人审批时长（小时）
           ,t2.t21_proc_approval_time_tot_cnt                                                       --第二十一个流程审批人审批时长（小时）
           ,t2.t22_proc_approval_time_tot_cnt                                                       --第二十二个流程审批人审批时长（小时）
           ,t2.t23_proc_approval_time_tot_cnt                                                       --第二十三个流程审批人审批时长（小时）
           ,t2.t24_proc_approval_time_tot_cnt                                                       --第二十四个流程审批人审批时长（小时）
           ,t2.t25_proc_approval_time_tot_cnt                                                       --第二十五个流程审批人审批时长（小时）
           ,t2.t26_proc_approval_time_tot_cnt                                                       --第二十六个流程审批人审批时长（小时）
           ,t2.t27_proc_approval_time_tot_cnt                                                       --第二十七个流程审批人审批时长（小时）
           ,t2.t28_proc_approval_time_tot_cnt                                                       --第二十八个流程审批人审批时长（小时）
           ,t2.t29_proc_approval_time_tot_cnt                                                       --第二十九个流程审批人审批时长（小时）
           ,t2.t30_proc_approval_time_tot_cnt                                                       --第三十个流程审批人审批时长（小时）
           ,t2.t31_proc_approval_time_tot_cnt                                                       --第三十一个流程审批人审批时长（小时）
           ,t2.t32_proc_approval_time_tot_cnt                                                       --第三十二个流程审批人审批时长（小时）
           ,t2.t33_proc_approval_time_tot_cnt                                                       --第三十三个流程审批人审批时长（小时）
           ,t2.t34_proc_approval_time_tot_cnt                                                       --第三十四个流程审批人审批时长（小时）
           ,t2.t35_proc_approval_time_tot_cnt                                                       --第三十五个流程审批人审批时长（小时）
      FROM ads.a_og_bill_approval_info_detail_day_eas_proc_tmp t1
      LEFT JOIN ads.a_og_bill_approval_info_detail_day_eas_approver_flat_tmp t2
        ON t1.recpt=t2.recpt
       AND t1.bill_number=t2.bill_number
       AND t1.procinstid=t2.procinstid
     WHERE t1.proc_rn=1'
   ;

    --获取临时表装载数据执行日志信息
    p_location:='15.2.Insert_a_og_bill_approval_info_detail_day_eas_tmp_Data';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --卸载数据
    p_location:='16.Delete_Date';
    EXECUTE IMMEDIATE 'TRUNCATE TABLE ads.a_og_bill_approval_info_detail_day_tmp';
    p_data_count:=SQL%ROWCOUNT;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --装载数据
    p_location:='17.Insert_Data';
    p_data_count:=0;
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    EXECUTE IMMEDIATE 'INSERT INTO ads.a_og_bill_approval_info_detail_day_tmp(
           the_date                                                                                 --日期
           ,the_month                                                                               --月份
           ,the_quarter                                                                             --季度
           ,the_year                                                                                --年份
           ,center                                                                                  --中心
           ,department                                                                              --部门
           ,sales_name                                                                              --销售代表
           ,bill_name                                                                               --单据名称
           ,bill_number                                                                             --单据编号
           ,cust_name                                                                               --客户名称
           ,proc_submitter                                                                          --流程提交人
           ,bill_status                                                                             --单据状态
           ,proc_submitter_time                                                                     --流程提交时间
           ,current_processor_name                                                                  --当前处理人
           ,t1_proc_approval_name                                                                   --第一个流程审批人
           ,t2_proc_approval_name                                                                   --第二个流程审批人
           ,t3_proc_approval_name                                                                   --第三个流程审批人
           ,t4_proc_approval_name                                                                   --第四个流程审批人
           ,t5_proc_approval_name                                                                   --第五个流程审批人
           ,t6_proc_approval_name                                                                   --第六个流程审批人
           ,t7_proc_approval_name                                                                   --第七个流程审批人
           ,t8_proc_approval_name                                                                   --第八个流程审批人
           ,t9_proc_approval_name                                                                   --第九个流程审批人
           ,t10_proc_approval_name                                                                  --第十个流程审批人
           ,t11_proc_approval_name                                                                  --第十一个流程审批人
           ,t12_proc_approval_name                                                                  --第十二个流程审批人
           ,t13_proc_approval_name                                                                  --第十三个流程审批人
           ,t14_proc_approval_name                                                                  --第十四个流程审批人
           ,t15_proc_approval_name                                                                  --第十五个流程审批人
           ,t16_proc_approval_name                                                                  --第十六个流程审批人
           ,t17_proc_approval_name                                                                  --第十七个流程审批人
           ,t18_proc_approval_name                                                                  --第十八个流程审批人
           ,t19_proc_approval_name                                                                  --第十九个流程审批人
           ,t20_proc_approval_name                                                                  --第二十个流程审批人
           ,t21_proc_approval_name                                                                  --第二十一个流程审批人
           ,t22_proc_approval_name                                                                  --第二十二个流程审批人
           ,t23_proc_approval_name                                                                  --第二十三个流程审批人
           ,t24_proc_approval_name                                                                  --第二十四个流程审批人
           ,t25_proc_approval_name                                                                  --第二十五个流程审批人
           ,t26_proc_approval_name                                                                  --第二十六个流程审批人
           ,t27_proc_approval_name                                                                  --第二十七个流程审批人
           ,t28_proc_approval_name                                                                  --第二十八个流程审批人
           ,t29_proc_approval_name                                                                  --第二十九个流程审批人
           ,t30_proc_approval_name                                                                  --第三十个流程审批人
           ,t31_proc_approval_name                                                                  --第三十一个流程审批人
           ,t32_proc_approval_name                                                                  --第三十二个流程审批人
           ,t33_proc_approval_name                                                                  --第三十三个流程审批人
           ,t34_proc_approval_name                                                                  --第三十四个流程审批人
           ,t35_proc_approval_name                                                                  --第三十五个流程审批人
           ,approval_node_tot_cnt                                                                   --审批节点数
           ,approval_time_tot_cnt                                                                   --审批总时长（分钟）
           ,proc_duration_time_cnt                                                                  --流程持续时间（分钟）
           ,current_processor_duration_time_cnt                                                     --当前处理人持续时间（分钟）
           ,t1_proc_approval_time_tot_cnt                                                           --第一个流程审批人审批时长
           ,t2_proc_approval_time_tot_cnt                                                           --第二个流程审批人审批时长
           ,t3_proc_approval_time_tot_cnt                                                           --第三个流程审批人审批时长
           ,t4_proc_approval_time_tot_cnt                                                           --第四个流程审批人审批时长
           ,t5_proc_approval_time_tot_cnt                                                           --第五个流程审批人审批时长
           ,t6_proc_approval_time_tot_cnt                                                           --第六个流程审批人审批时长
           ,t7_proc_approval_time_tot_cnt                                                           --第七个流程审批人审批时长
           ,t8_proc_approval_time_tot_cnt                                                           --第八个流程审批人审批时长
           ,t9_proc_approval_time_tot_cnt                                                           --第九个流程审批人审批时长
           ,t10_proc_approval_time_tot_cnt                                                          --第十个流程审批人审批时长
           ,t11_proc_approval_time_tot_cnt                                                          --第十一个流程审批人审批时长
           ,t12_proc_approval_time_tot_cnt                                                          --第十二个流程审批人审批时长
           ,t13_proc_approval_time_tot_cnt                                                          --第十三个流程审批人审批时长（小时）
           ,t14_proc_approval_time_tot_cnt                                                          --第十四个流程审批人审批时长（小时）
           ,t15_proc_approval_time_tot_cnt                                                          --第十五个流程审批人审批时长（小时）
           ,t16_proc_approval_time_tot_cnt                                                          --第十六个流程审批人审批时长（小时）
           ,t17_proc_approval_time_tot_cnt                                                          --第十七个流程审批人审批时长（小时）
           ,t18_proc_approval_time_tot_cnt                                                          --第十八个流程审批人审批时长（小时）
           ,t19_proc_approval_time_tot_cnt                                                          --第十九个流程审批人审批时长（小时）
           ,t20_proc_approval_time_tot_cnt                                                          --第二十个流程审批人审批时长（小时）
           ,t21_proc_approval_time_tot_cnt                                                          --第二十一个流程审批人审批时长（小时）
           ,t22_proc_approval_time_tot_cnt                                                          --第二十二个流程审批人审批时长（小时）
           ,t23_proc_approval_time_tot_cnt                                                          --第二十三个流程审批人审批时长（小时）
           ,t24_proc_approval_time_tot_cnt                                                          --第二十四个流程审批人审批时长（小时）
           ,t25_proc_approval_time_tot_cnt                                                          --第二十五个流程审批人审批时长（小时）
           ,t26_proc_approval_time_tot_cnt                                                          --第二十六个流程审批人审批时长（小时）
           ,t27_proc_approval_time_tot_cnt                                                          --第二十七个流程审批人审批时长（小时）
           ,t28_proc_approval_time_tot_cnt                                                          --第二十八个流程审批人审批时长（小时）
           ,t29_proc_approval_time_tot_cnt                                                          --第二十九个流程审批人审批时长（小时）
           ,t30_proc_approval_time_tot_cnt                                                          --第三十个流程审批人审批时长（小时）
           ,t31_proc_approval_time_tot_cnt                                                          --第三十一个流程审批人审批时长（小时）
           ,t32_proc_approval_time_tot_cnt                                                          --第三十二个流程审批人审批时长（小时）
           ,t33_proc_approval_time_tot_cnt                                                          --第三十三个流程审批人审批时长（小时）
           ,t34_proc_approval_time_tot_cnt                                                          --第三十四个流程审批人审批时长（小时）
           ,t35_proc_approval_time_tot_cnt                                                          --第三十五个流程审批人审批时长（小时）
           ,sor_tab_en_name                                                                         --源表英文名
           ,sor_tab_cn_name                                                                         --源表中文名
           ,etl_date                                                                                --抽取时间
           ,data_date                                                                               --数据日期
    )
    SELECT t2.the_date                                                                              --日期
           ,t2.the_month                                                                            --月份
           ,t2.the_quarter                                                                          --季度
           ,t2.the_year                                                                             --年份
           ,t1.center
           ,t1.department
           ,t1.sales_name
           ,t1.bill_name                                                                            --单据名称
           ,t1.bill_number                                                                          --单据编号
           ,t1.cust_name                                                                            --客户名称
           ,t1.proc_submitter                                                                       --流程提交人
           ,t1.bill_status                                                                          --单据状态
           ,t1.proc_submitter_time                                                                  --流程提交时间
           ,t1.current_processor_name                                                               --当前处理人
           ,t1.t1_proc_approval_name                                                                --第一个流程审批人
           ,t1.t2_proc_approval_name                                                                --第二个流程审批人
           ,t1.t3_proc_approval_name                                                                --第三个流程审批人
           ,t1.t4_proc_approval_name                                                                --第四个流程审批人
           ,t1.t5_proc_approval_name                                                                --第五个流程审批人
           ,t1.t6_proc_approval_name                                                                --第六个流程审批人
           ,t1.t7_proc_approval_name                                                                --第七个流程审批人
           ,t1.t8_proc_approval_name                                                                --第八个流程审批人
           ,t1.t9_proc_approval_name                                                                --第九个流程审批人
           ,t1.t10_proc_approval_name                                                               --第十个流程审批人
           ,t1.t11_proc_approval_name                                                               --第十一个流程审批人
           ,t1.t12_proc_approval_name                                                               --第十二个流程审批人
           ,t1.t13_proc_approval_name                                                               --第十三个流程审批人
           ,t1.t14_proc_approval_name                                                               --第十四个流程审批人
           ,t1.t15_proc_approval_name                                                               --第十五个流程审批人
           ,t1.t16_proc_approval_name                                                               --第十六个流程审批人
           ,t1.t17_proc_approval_name                                                               --第十七个流程审批人
           ,t1.t18_proc_approval_name                                                               --第十八个流程审批人
           ,t1.t19_proc_approval_name                                                               --第十九个流程审批人
           ,t1.t20_proc_approval_name                                                               --第二十个流程审批人
           ,t1.t21_proc_approval_name                                                               --第二十一个流程审批人
           ,t1.t22_proc_approval_name                                                               --第二十二个流程审批人
           ,t1.t23_proc_approval_name                                                               --第二十三个流程审批人
           ,t1.t24_proc_approval_name                                                               --第二十四个流程审批人
           ,t1.t25_proc_approval_name                                                               --第二十五个流程审批人
           ,t1.t26_proc_approval_name                                                               --第二十六个流程审批人
           ,t1.t27_proc_approval_name                                                               --第二十七个流程审批人
           ,t1.t28_proc_approval_name                                                               --第二十八个流程审批人
           ,t1.t29_proc_approval_name                                                               --第二十九个流程审批人
           ,t1.t30_proc_approval_name                                                               --第三十个流程审批人
           ,t1.t31_proc_approval_name                                                               --第三十一个流程审批人
           ,t1.t32_proc_approval_name                                                               --第三十二个流程审批人
           ,t1.t33_proc_approval_name                                                               --第三十三个流程审批人
           ,t1.t34_proc_approval_name                                                               --第三十四个流程审批人
           ,t1.t35_proc_approval_name                                                               --第三十五个流程审批人
           ,t1.approval_node_tot_cnt                                                                --审批节点数
           ,t1.approval_time_tot_cnt                                                                --审批总时长（分钟）
           ,t1.proc_duration_time_cnt                                                               --流程持续时间（分钟）
           ,t1.current_processor_duration_time_cnt                                                  --当前处理人持续时间（分钟）
           ,NVL(t1.t1_proc_approval_time_tot_cnt,0)                                                 --第一个流程审批人审批时长
           ,NVL(t1.t2_proc_approval_time_tot_cnt,0)                                                 --第二个流程审批人审批时长
           ,NVL(t1.t3_proc_approval_time_tot_cnt,0)                                                 --第三个流程审批人审批时长
           ,NVL(t1.t4_proc_approval_time_tot_cnt,0)                                                 --第四个流程审批人审批时长
           ,NVL(t1.t5_proc_approval_time_tot_cnt,0)                                                 --第五个流程审批人审批时长
           ,NVL(t1.t6_proc_approval_time_tot_cnt,0)                                                 --第六个流程审批人审批时长
           ,NVL(t1.t7_proc_approval_time_tot_cnt,0)                                                 --第七个流程审批人审批时长
           ,NVL(t1.t8_proc_approval_time_tot_cnt,0)                                                 --第八个流程审批人审批时长
           ,NVL(t1.t9_proc_approval_time_tot_cnt,0)                                                 --第九个流程审批人审批时长
           ,NVL(t1.t10_proc_approval_time_tot_cnt,0)                                                --第十个流程审批人审批时长
           ,NVL(t1.t11_proc_approval_time_tot_cnt,0)                                                --第十一个流程审批人审批时长
           ,NVL(t1.t12_proc_approval_time_tot_cnt,0)                                                --第十二个流程审批人审批时长
           ,NVL(t1.t13_proc_approval_time_tot_cnt,0)                                                --第十三个流程审批人审批时长（小时）
           ,NVL(t1.t14_proc_approval_time_tot_cnt,0)                                                --第十四个流程审批人审批时长（小时）
           ,NVL(t1.t15_proc_approval_time_tot_cnt,0)                                                --第十五个流程审批人审批时长（小时）
           ,NVL(t1.t16_proc_approval_time_tot_cnt,0)                                                --第十六个流程审批人审批时长（小时）
           ,NVL(t1.t17_proc_approval_time_tot_cnt,0)                                                --第十七个流程审批人审批时长（小时）
           ,NVL(t1.t18_proc_approval_time_tot_cnt,0)                                                --第十八个流程审批人审批时长（小时）
           ,NVL(t1.t19_proc_approval_time_tot_cnt,0)                                                --第十九个流程审批人审批时长（小时）
           ,NVL(t1.t20_proc_approval_time_tot_cnt,0)                                                --第二十个流程审批人审批时长（小时）
           ,NVL(t1.t21_proc_approval_time_tot_cnt,0)                                                --第二十一个流程审批人审批时长（小时）
           ,NVL(t1.t22_proc_approval_time_tot_cnt,0)                                                --第二十二个流程审批人审批时长（小时）
           ,NVL(t1.t23_proc_approval_time_tot_cnt,0)                                                --第二十三个流程审批人审批时长（小时）
           ,NVL(t1.t24_proc_approval_time_tot_cnt,0)                                                --第二十四个流程审批人审批时长（小时）
           ,NVL(t1.t25_proc_approval_time_tot_cnt,0)                                                --第二十五个流程审批人审批时长（小时）
           ,NVL(t1.t26_proc_approval_time_tot_cnt,0)                                                --第二十六个流程审批人审批时长（小时）
           ,NVL(t1.t27_proc_approval_time_tot_cnt,0)                                                --第二十七个流程审批人审批时长（小时）
           ,NVL(t1.t28_proc_approval_time_tot_cnt,0)                                                --第二十八个流程审批人审批时长（小时）
           ,NVL(t1.t29_proc_approval_time_tot_cnt,0)                                                --第二十九个流程审批人审批时长（小时）
           ,NVL(t1.t30_proc_approval_time_tot_cnt,0)                                                --第三十个流程审批人审批时长（小时）
           ,NVL(t1.t31_proc_approval_time_tot_cnt,0)                                                --第三十一个流程审批人审批时长（小时）
           ,NVL(t1.t32_proc_approval_time_tot_cnt,0)                                                --第三十二个流程审批人审批时长（小时）
           ,NVL(t1.t33_proc_approval_time_tot_cnt,0)                                                --第三十三个流程审批人审批时长（小时）
           ,NVL(t1.t34_proc_approval_time_tot_cnt,0)                                                --第三十四个流程审批人审批时长（小时）
           ,NVL(t1.t35_proc_approval_time_tot_cnt,0)                                                --第三十五个流程审批人审批时长（小时）
           ,''ods.o_crm_paez_t_syjfk_entry113509|ods.o_crm_paez_t_salesforecast|ods.o_crm_paez_t_cust_entry111517|ods.o_crm_paez_t_sjxx_entry113014|ods.o_crm_t_wf_pibimap|ods.o_crm_v_wf_procinstm|ods.o_crm_v_wf_actinstmg|ods.o_crm_v_wf_assignmg|ods.o_crm_v_wf_receivermg|ods.o_crm_t_sec_user|ods.o_crm_t_bd_department_l|ods.o_crm_t_bd_staff_l|ods.o_crm_v_wf_approvalassignmg|ods.o_crm_v_wf_approvalitemmg|ods.o_crm_t_bd_staffpostinfo''
           ,''贴源层.送样申请及反馈表|贴源层.销售备货单|贴源层.用户标识变更单|贴源层.商机信息表|贴源层.工作流实例与业务单据关联关系表|贴源层.工作流实例|贴源层.工作流节点实例表|贴源层.工作流任务表|贴源层.工作流任务接受人|贴源层.用户|贴源层.部门信息扩展表|贴源层.员工任岗信息扩展表|贴源层.工作流任务详情|贴源层.工作流任务处理记录''
           ,TO_CHAR(SYSDATE,''YYYY-MM-DD HH24:MI:SS'')                                              --抽取时间
           ,'''||p_data_date||'''                                                                   --数据日期
      FROM ads.a_og_bill_approval_info_detail_day_crm_tmp t1
      LEFT JOIN dim.d_calendar_dim t2
        ON TO_DATE('''||p_data_date||''',''YYYY-MM-DD'')=t2.the_date     
     WHERE 1=1'
    ;

    EXECUTE IMMEDIATE 'INSERT INTO ads.a_og_bill_approval_info_detail_day_tmp(
           the_date                                                                                 --日期
           ,the_month                                                                               --月份
           ,the_quarter                                                                             --季度
           ,the_year                                                                                --年份
           ,center                                                                                  --中心
           ,department                                                                              --部门
           ,sales_name                                                                              --销售代表
           ,bill_name                                                                               --单据名称
           ,bill_number                                                                             --单据编号
           ,cust_name                                                                               --客户名称
           ,proc_submitter                                                                          --流程提交人
           ,bill_status                                                                             --单据状态
           ,proc_submitter_time                                                                     --流程提交时间
           ,current_processor_name                                                                  --当前处理人
           ,t1_proc_approval_name                                                                   --第一个流程审批人
           ,t2_proc_approval_name                                                                   --第二个流程审批人
           ,t3_proc_approval_name                                                                   --第三个流程审批人
           ,t4_proc_approval_name                                                                   --第四个流程审批人
           ,t5_proc_approval_name                                                                   --第五个流程审批人
           ,t6_proc_approval_name                                                                   --第六个流程审批人
           ,t7_proc_approval_name                                                                   --第七个流程审批人
           ,t8_proc_approval_name                                                                   --第八个流程审批人
           ,t9_proc_approval_name                                                                   --第九个流程审批人
           ,t10_proc_approval_name                                                                  --第十个流程审批人
           ,t11_proc_approval_name                                                                  --第十一个流程审批人
           ,t12_proc_approval_name                                                                  --第十二个流程审批人
           ,t13_proc_approval_name                                                                  --第十三个流程审批人
           ,t14_proc_approval_name                                                                  --第十四个流程审批人
           ,t15_proc_approval_name                                                                  --第十五个流程审批人
           ,t16_proc_approval_name                                                                  --第十六个流程审批人
           ,t17_proc_approval_name                                                                  --第十七个流程审批人
           ,t18_proc_approval_name                                                                  --第十八个流程审批人
           ,t19_proc_approval_name                                                                  --第十九个流程审批人
           ,t20_proc_approval_name                                                                  --第二十个流程审批人
           ,t21_proc_approval_name                                                                  --第二十一个流程审批人
           ,t22_proc_approval_name                                                                  --第二十二个流程审批人
           ,t23_proc_approval_name                                                                  --第二十三个流程审批人
           ,t24_proc_approval_name                                                                  --第二十四个流程审批人
           ,t25_proc_approval_name                                                                  --第二十五个流程审批人
           ,t26_proc_approval_name                                                                  --第二十六个流程审批人
           ,t27_proc_approval_name                                                                  --第二十七个流程审批人
           ,t28_proc_approval_name                                                                  --第二十八个流程审批人
           ,t29_proc_approval_name                                                                  --第二十九个流程审批人
           ,t30_proc_approval_name                                                                  --第三十个流程审批人
           ,t31_proc_approval_name                                                                  --第三十一个流程审批人
           ,t32_proc_approval_name                                                                  --第三十二个流程审批人
           ,t33_proc_approval_name                                                                  --第三十三个流程审批人
           ,t34_proc_approval_name                                                                  --第三十四个流程审批人
           ,t35_proc_approval_name                                                                  --第三十五个流程审批人
           ,approval_node_tot_cnt                                                                   --审批节点数
           ,approval_time_tot_cnt                                                                   --审批总时长（分钟）
           ,proc_duration_time_cnt                                                                  --流程持续时间（分钟）
           ,current_processor_duration_time_cnt                                                     --当前处理人持续时间（分钟）
           ,t1_proc_approval_time_tot_cnt                                                           --第一个流程审批人审批时长
           ,t2_proc_approval_time_tot_cnt                                                           --第二个流程审批人审批时长
           ,t3_proc_approval_time_tot_cnt                                                           --第三个流程审批人审批时长
           ,t4_proc_approval_time_tot_cnt                                                           --第四个流程审批人审批时长
           ,t5_proc_approval_time_tot_cnt                                                           --第五个流程审批人审批时长
           ,t6_proc_approval_time_tot_cnt                                                           --第六个流程审批人审批时长
           ,t7_proc_approval_time_tot_cnt                                                           --第七个流程审批人审批时长
           ,t8_proc_approval_time_tot_cnt                                                           --第八个流程审批人审批时长
           ,t9_proc_approval_time_tot_cnt                                                           --第九个流程审批人审批时长
           ,t10_proc_approval_time_tot_cnt                                                          --第十个流程审批人审批时长
           ,t11_proc_approval_time_tot_cnt                                                          --第十一个流程审批人审批时长
           ,t12_proc_approval_time_tot_cnt                                                          --第十二个流程审批人审批时长
           ,t13_proc_approval_time_tot_cnt                                                          --第十三个流程审批人审批时长（小时）
           ,t14_proc_approval_time_tot_cnt                                                          --第十四个流程审批人审批时长（小时）
           ,t15_proc_approval_time_tot_cnt                                                          --第十五个流程审批人审批时长（小时）
           ,t16_proc_approval_time_tot_cnt                                                          --第十六个流程审批人审批时长（小时）
           ,t17_proc_approval_time_tot_cnt                                                          --第十七个流程审批人审批时长（小时）
           ,t18_proc_approval_time_tot_cnt                                                          --第十八个流程审批人审批时长（小时）
           ,t19_proc_approval_time_tot_cnt                                                          --第十九个流程审批人审批时长（小时）
           ,t20_proc_approval_time_tot_cnt                                                          --第二十个流程审批人审批时长（小时）
           ,t21_proc_approval_time_tot_cnt                                                          --第二十一个流程审批人审批时长（小时）
           ,t22_proc_approval_time_tot_cnt                                                          --第二十二个流程审批人审批时长（小时）
           ,t23_proc_approval_time_tot_cnt                                                          --第二十三个流程审批人审批时长（小时）
           ,t24_proc_approval_time_tot_cnt                                                          --第二十四个流程审批人审批时长（小时）
           ,t25_proc_approval_time_tot_cnt                                                          --第二十五个流程审批人审批时长（小时）
           ,t26_proc_approval_time_tot_cnt                                                          --第二十六个流程审批人审批时长（小时）
           ,t27_proc_approval_time_tot_cnt                                                          --第二十七个流程审批人审批时长（小时）
           ,t28_proc_approval_time_tot_cnt                                                          --第二十八个流程审批人审批时长（小时）
           ,t29_proc_approval_time_tot_cnt                                                          --第二十九个流程审批人审批时长（小时）
           ,t30_proc_approval_time_tot_cnt                                                          --第三十个流程审批人审批时长（小时）
           ,t31_proc_approval_time_tot_cnt                                                          --第三十一个流程审批人审批时长（小时）
           ,t32_proc_approval_time_tot_cnt                                                          --第三十二个流程审批人审批时长（小时）
           ,t33_proc_approval_time_tot_cnt                                                          --第三十三个流程审批人审批时长（小时）
           ,t34_proc_approval_time_tot_cnt                                                          --第三十四个流程审批人审批时长（小时）
           ,t35_proc_approval_time_tot_cnt                                                          --第三十五个流程审批人审批时长（小时）
           ,sor_tab_en_name                                                                         --源表英文名
           ,sor_tab_cn_name                                                                         --源表中文名
           ,etl_date                                                                                --抽取时间
           ,data_date                                                                               --数据日期
    )
    SELECT t2.the_date                                                                              --日期
           ,t2.the_month                                                                            --月份
           ,t2.the_quarter                                                                          --季度
           ,t2.the_year                                                                             --年份
           ,t1.center
           ,t1.department
           ,t1.sales_name
           ,t1.bill_name                                                                            --单据名称
           ,t1.bill_number                                                                          --单据编号
           ,t1.cust_name                                                                            --客户名称
           ,t1.proc_submitter                                                                       --流程提交人
           ,t1.bill_status                                                                          --单据状态
           ,t1.proc_submitter_time                                                                  --流程提交时间
           ,t1.current_processor_name                                                               --当前处理人
           ,t1.t1_proc_approval_name                                                                --第一个流程审批人
           ,t1.t2_proc_approval_name                                                                --第二个流程审批人
           ,t1.t3_proc_approval_name                                                                --第三个流程审批人
           ,t1.t4_proc_approval_name                                                                --第四个流程审批人
           ,t1.t5_proc_approval_name                                                                --第五个流程审批人
           ,t1.t6_proc_approval_name                                                                --第六个流程审批人
           ,t1.t7_proc_approval_name                                                                --第七个流程审批人
           ,t1.t8_proc_approval_name                                                                --第八个流程审批人
           ,t1.t9_proc_approval_name                                                                --第九个流程审批人
           ,t1.t10_proc_approval_name                                                               --第十个流程审批人
           ,t1.t11_proc_approval_name                                                               --第十一个流程审批人
           ,t1.t12_proc_approval_name                                                               --第十二个流程审批人
           ,t1.t13_proc_approval_name                                                               --第十三个流程审批人
           ,t1.t14_proc_approval_name                                                               --第十四个流程审批人
           ,t1.t15_proc_approval_name                                                               --第十五个流程审批人
           ,t1.t16_proc_approval_name                                                               --第十六个流程审批人
           ,t1.t17_proc_approval_name                                                               --第十七个流程审批人
           ,t1.t18_proc_approval_name                                                               --第十八个流程审批人
           ,t1.t19_proc_approval_name                                                               --第十九个流程审批人
           ,t1.t20_proc_approval_name                                                               --第二十个流程审批人
           ,t1.t21_proc_approval_name                                                               --第二十一个流程审批人
           ,t1.t22_proc_approval_name                                                               --第二十二个流程审批人
           ,t1.t23_proc_approval_name                                                               --第二十三个流程审批人
           ,t1.t24_proc_approval_name                                                               --第二十四个流程审批人
           ,t1.t25_proc_approval_name                                                               --第二十五个流程审批人
           ,t1.t26_proc_approval_name                                                               --第二十六个流程审批人
           ,t1.t27_proc_approval_name                                                               --第二十七个流程审批人
           ,t1.t28_proc_approval_name                                                               --第二十八个流程审批人
           ,t1.t29_proc_approval_name                                                               --第二十九个流程审批人
           ,t1.t30_proc_approval_name                                                               --第三十个流程审批人
           ,t1.t31_proc_approval_name                                                               --第三十一个流程审批人
           ,t1.t32_proc_approval_name                                                               --第三十二个流程审批人
           ,t1.t33_proc_approval_name                                                               --第三十三个流程审批人
           ,t1.t34_proc_approval_name                                                               --第三十四个流程审批人
           ,t1.t35_proc_approval_name                                                               --第三十五个流程审批人
           ,t1.approval_node_tot_cnt                                                                --审批节点数
           ,t1.approval_time_tot_cnt                                                                --审批总时长（分钟）
           ,t1.proc_duration_time_cnt                                                               --流程持续时间（分钟）
           ,t1.current_processor_duration_time_cnt                                                  --当前处理人持续时间（分钟）
           ,NVL(t1.t1_proc_approval_time_tot_cnt,0)                                                 --第一个流程审批人审批时长
           ,NVL(t1.t2_proc_approval_time_tot_cnt,0)                                                 --第二个流程审批人审批时长
           ,NVL(t1.t3_proc_approval_time_tot_cnt,0)                                                 --第三个流程审批人审批时长
           ,NVL(t1.t4_proc_approval_time_tot_cnt,0)                                                 --第四个流程审批人审批时长
           ,NVL(t1.t5_proc_approval_time_tot_cnt,0)                                                 --第五个流程审批人审批时长
           ,NVL(t1.t6_proc_approval_time_tot_cnt,0)                                                 --第六个流程审批人审批时长
           ,NVL(t1.t7_proc_approval_time_tot_cnt,0)                                                 --第七个流程审批人审批时长
           ,NVL(t1.t8_proc_approval_time_tot_cnt,0)                                                 --第八个流程审批人审批时长
           ,NVL(t1.t9_proc_approval_time_tot_cnt,0)                                                 --第九个流程审批人审批时长
           ,NVL(t1.t10_proc_approval_time_tot_cnt,0)                                                --第十个流程审批人审批时长
           ,NVL(t1.t11_proc_approval_time_tot_cnt,0)                                                --第十一个流程审批人审批时长
           ,NVL(t1.t12_proc_approval_time_tot_cnt,0)                                                --第十二个流程审批人审批时长
           ,NVL(t1.t13_proc_approval_time_tot_cnt,0)                                                --第十三个流程审批人审批时长（小时）
           ,NVL(t1.t14_proc_approval_time_tot_cnt,0)                                                --第十四个流程审批人审批时长（小时）
           ,NVL(t1.t15_proc_approval_time_tot_cnt,0)                                                --第十五个流程审批人审批时长（小时）
           ,NVL(t1.t16_proc_approval_time_tot_cnt,0)                                                --第十六个流程审批人审批时长（小时）
           ,NVL(t1.t17_proc_approval_time_tot_cnt,0)                                                --第十七个流程审批人审批时长（小时）
           ,NVL(t1.t18_proc_approval_time_tot_cnt,0)                                                --第十八个流程审批人审批时长（小时）
           ,NVL(t1.t19_proc_approval_time_tot_cnt,0)                                                --第十九个流程审批人审批时长（小时）
           ,NVL(t1.t20_proc_approval_time_tot_cnt,0)                                                --第二十个流程审批人审批时长（小时）
           ,NVL(t1.t21_proc_approval_time_tot_cnt,0)                                                --第二十一个流程审批人审批时长（小时）
           ,NVL(t1.t22_proc_approval_time_tot_cnt,0)                                                --第二十二个流程审批人审批时长（小时）
           ,NVL(t1.t23_proc_approval_time_tot_cnt,0)                                                --第二十三个流程审批人审批时长（小时）
           ,NVL(t1.t24_proc_approval_time_tot_cnt,0)                                                --第二十四个流程审批人审批时长（小时）
           ,NVL(t1.t25_proc_approval_time_tot_cnt,0)                                                --第二十五个流程审批人审批时长（小时）
           ,NVL(t1.t26_proc_approval_time_tot_cnt,0)                                                --第二十六个流程审批人审批时长（小时）
           ,NVL(t1.t27_proc_approval_time_tot_cnt,0)                                                --第二十七个流程审批人审批时长（小时）
           ,NVL(t1.t28_proc_approval_time_tot_cnt,0)                                                --第二十八个流程审批人审批时长（小时）
           ,NVL(t1.t29_proc_approval_time_tot_cnt,0)                                                --第二十九个流程审批人审批时长（小时）
           ,NVL(t1.t30_proc_approval_time_tot_cnt,0)                                                --第三十个流程审批人审批时长（小时）
           ,NVL(t1.t31_proc_approval_time_tot_cnt,0)                                                --第三十一个流程审批人审批时长（小时）
           ,NVL(t1.t32_proc_approval_time_tot_cnt,0)                                                --第三十二个流程审批人审批时长（小时）
           ,NVL(t1.t33_proc_approval_time_tot_cnt,0)                                                --第三十三个流程审批人审批时长（小时）
           ,NVL(t1.t34_proc_approval_time_tot_cnt,0)                                                --第三十四个流程审批人审批时长（小时）
           ,NVL(t1.t35_proc_approval_time_tot_cnt,0)                                                --第三十五个流程审批人审批时长（小时）
           ,''ods.o_eas_t_sd_saleorder|ods.o_eas_t_sd_postrequisition|ods.o_eas_t_wfr_assignview|ods.o_eas_t_wfr_procinstview|ods.o_eas_t_bd_person|ods.o_eas_t_bd_customer''
           ,''贴源层.销售订单|贴源层.发货通知单|贴源层.工作流任务视图|贴源层.流程实例|贴源层.员工个人信息|贴源层.客户基础数据''
           ,TO_CHAR(SYSDATE,''YYYY-MM-DD HH24:MI:SS'')                                              --抽取时间
           ,'''||p_data_date||'''                                                                   --数据日期
      FROM ads.a_og_bill_approval_info_detail_day_eas_tmp t1
      LEFT JOIN dim.d_calendar_dim t2
        ON TO_DATE('''||p_data_date||''',''YYYY-MM-DD'')=t2.the_date     
     WHERE 1=1'
    ;

    --数据装载完毕生成影响记录数
    p_data_count:=SQL%ROWCOUNT;
    p_location:='18.Finish_Program';
    p_message_text:='Success';
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);
    COMMIT;

    --删除临时表
    p_location:='19.Delete_Temp_Table';
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_BILL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_APPROVAL_DETAIL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_APPROVAL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_PROC_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_APPROVER_FLAT_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_CRM_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_BILL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_SALES_STAFF_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_APPROVAL_DETAIL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_APPROVAL_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_PROC_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_APPROVER_FLAT_TMP',p_run_flag);
    ads.sp_a_delete_tmp_table('ADS','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_EAS_TMP',p_run_flag);
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --应用层数据表无感知处理
    p_location:='20.Application_Data_Service_Data_No_Perception_Process';
    ads.sp_a_replace_data_table('A_OG_BILL_APPROVAL_INFO_DETAIL_DAY_TMP','A_OG_BILL_APPROVAL_INFO_DETAIL_DAY',p_run_flag);
    fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);

    --程序正确执行返回值
    out_run_flag:='0';
    out_message_text:='';

    --程序执行错误处理
    EXCEPTION
        WHEN OTHERS THEN
            p_run_flag:='1';
            p_location:='0.Error';
            p_message_text:=SQLERRM;
            fds.sp_f_sm_pro_run_log(p_pro_name,p_location,p_data_count,p_run_flag,p_message_text,p_start_date,p_data_date,p_run_flag);
            out_run_flag:='1';
            out_message_text:=SQLERRM;
            ROLLBACK;
END;