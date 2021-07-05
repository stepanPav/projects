from queue import Queue
import math
import random
import collections
import copy

from matplotlib import pyplot as plt


def get_p(m, n, t):
    cur_time = 0
    all_p = [[]for i in range(m)]
    while cur_time < t:
        for i in range(m):
            all_p[i].append(cur_time + random.random() * n)
        cur_time += n
    return all_p


def nums_of_repeat(frame):
    res = []
    replica = 0
    for i in range(len(frame)):
        if len(frame[i]) > 1:
            replica += 1
        else:
            res.append(frame[i][0])

    for j in range(len(res)):
        for k in range(len(res)):
            if j != k and res[j] == res[k] and copies.count(res[j]) == 0:
                copies.append(res[j])
                replica += res.count(res[j]) - 1

        return replica
    return 0





def solve(frame):
    res = 0
    step = 0
    while res != len(frame):
        prev_res = res
        res = 0
        for i in range(len(frame)):  # Текущий абонет
            if len(frame[i]) != 1:
                for j in range(len(frame[i])):  # текущее сообщение абонента
                    is_equal = 0
                    for k in range(len(frame)):
                        for l in range(len((frame[k]))):
                            if frame[i][j] == frame[k][l] and i != k:
                                is_equal = 1
                                break
                        if is_equal == 1:
                            break
                    if is_equal == 1:
                        continue
                    else:
                        frame[i][0] = frame[i][j]  # этот элемент не повторяется
                        for k in range(1, len(frame[i])):
                            frame[i].pop(len(frame[i]) - 1)
                        break
            else:
                res += 1
        if res == prev_res and res != 0:
            return frame
    return frame

    pass


def slotted_aloha(subs, t, w, task):
    time = 0
    m = len(subs)
    queue_sub = []
    for i in range(m):
        queue_sub.append(Queue())  # массив очередей сообщений для каждого абонента
    mes_in_queue = [0 for i in range(m)]
    total_mes_in_queue = 0
    mes_sent = 0
    total_lost = 0
    while time < t:
        frame = []  # Индекс - номер абонента, значение - номер передачи в фрейме
        for i in range(m):
            while subs[i][mes_in_queue[i]] < time:
                queue_sub[i].put(subs[i][mes_in_queue[i]])
                mes_in_queue[i] += 1
                total_mes_in_queue += 1
        for i in range(m):  # определение места в фрейме
            if queue_sub[i].qsize() > 0:
                tmp = random.random()

                duplicates = []
                if task == 2:
                    if tmp < 0.5:
                        tmp = 2
                    elif tmp < 0.78:
                        tmp = 4
                    else:
                        tmp = 8
                if task == 1:
                    tmp = 2
                if task == 0:
                    tmp = int(random.random() * w)
                    for j in range(2):
                        duplicates.append(tmp)
                    frame.append(duplicates)

                else:
                    for r in range(tmp):
                        duplicates.append(int(random.random() * w))
                    frame.append(duplicates)
            else:
                frame.append([])

        if time > 0:
            res = solve(frame)
            packet_lost = nums_of_repeat(res)
            total_lost += packet_lost
            mes_sent += m - packet_lost

        time += w
    return mes_sent/time, total_lost/time



if __name__ == '__main__':
    n = 200  # количество окон в фрейме
    t = 100000
    p_sub = []  # массив p для каждого абонента
    res_d = []
    g = []
    res_plr1 = []
    res_thr1 = []
    res_plr2 = []
    res_thr2 = []
    res_plr3 = []
    res_thr3 = []
    for i in range(1, 11):
        print(i)
        g.append(i / 10)
        m = int(n / 10)*i
        p_sub = get_p(m, n, t)
        thr, plr = slotted_aloha(p_sub, t, n, 2)
        res_thr1.append(thr)
        res_plr1.append(plr)
        thr, plr = slotted_aloha(p_sub, t, n, 1)
        res_thr2.append(thr)
        res_plr2.append(plr)
        thr, plr = slotted_aloha(p_sub, t, n, 0)
        res_thr3.append(thr)
        res_plr3.append(plr)
    
    plt.figure()
    plt.plot(g, res_thr1, label="IRSA")
    plt.plot(g, res_thr2, label="CRDSA")
    plt.plot(g, res_thr3, label="Slotted Aloha")
    plt.xlabel('Normalized Offered Traffic, G')
    plt.ylabel('Normalized Throughput, T')
    plt.legend()
    plt.grid(True)

    plt.figure()
    plt.plot(g, res_plr1, label='IRSA')
    plt.plot(g, res_plr2, label='CRDSA')
    plt.plot(g, res_plr3, label='ALOHA')
    plt.yscale("log")
    plt.xlabel('Normalized Offered Traffic, G')
    plt.ylabel('PLR')
    plt.legend()
    plt.grid(True)
    plt.show()

