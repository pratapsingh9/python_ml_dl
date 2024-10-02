#include <bits/stdc++.h>
struct ListNode
{
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};


class Solution {
public:
    ListNode* partition(ListNode* head, int x) {
        ListNode* dummy1 = new ListNode();
        ListNode* tem = dummy1;
        ListNode* du = new ListNode();
        ListNode* temp = du;

        while (head != NULL) {
            if (head->val < x) {
                tem->next = head;
                tem = tem->next;
            } else {
                temp->next = head;
                temp = temp->next;
            }
            head = head->next;
        }
        if(dummy1->next == NULL) return du->next;
        tem->next = du->next;
        temp->next = NULL;
        return dummy1->next;
    }
};